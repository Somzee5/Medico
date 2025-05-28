import cron from 'node-cron';
import Booking from '../models/BookingSchema.js';
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import { sendAppointmentReminderEmail } from './emailSender.js';
import moment from 'moment-timezone';

// Run every minute to check for upcoming appointments
cron.schedule('* * * * *', async () => {
    try {
        const now = moment().tz('Asia/Kolkata');
        const fiveMinutesFromNow = now.clone().add(5, 'minutes');

        // Find all bookings that start in 5 minutes and haven't had reminders sent
        const upcomingBookings = await Booking.find({
            status: 'approved',
            reminderSent: false,
            appointmentStartTime: {
                $gte: now.toDate(),
                $lte: fiveMinutesFromNow.toDate()
            }
        }).populate('user', 'name email').populate('doctor', 'name email');

        console.log(`Found ${upcomingBookings.length} upcoming bookings to process`);

        for (const booking of upcomingBookings) {
            const { user, doctor, timeSlot, join_url, start_url } = booking;

            // Debug logging
            console.log('Processing booking:', {
                bookingId: booking._id,
                userEmail: user?.email,
                doctorEmail: doctor?.email,
                joinUrl: join_url,
                startUrl: start_url
            });

            if (!join_url) {
                console.error(`No Zoom meeting URL found for booking ${booking._id}`);
                continue;
            }

            if (!user?.email || !doctor?.email) {
                console.error(`Missing email for booking ${booking._id}:`, {
                    userEmail: user?.email,
                    doctorEmail: doctor?.email
                });
                continue;
            }

            try {
                // Send email to patient
                console.log(`Attempting to send email to patient: ${user.email}`);
                await sendAppointmentReminderEmail(
                    user.email,
                    user.name,
                    doctor.name,
                    `${timeSlot.day}, ${moment(booking.appointmentStartTime).format('MMMM D, YYYY')}, ${timeSlot.startingTime} IST`,
                    join_url,
                    start_url,
                    false // isDoctor = false for patient
                );
                console.log(`Successfully sent email to patient: ${user.email}`);

                // Send email to doctor
                console.log(`Attempting to send email to doctor: ${doctor.email}`);
                await sendAppointmentReminderEmail(
                    doctor.email,
                    doctor.name,
                    user.name,
                    `${timeSlot.day}, ${moment(booking.appointmentStartTime).format('MMMM D, YYYY')}, ${timeSlot.startingTime} IST`,
                    join_url,
                    start_url,
                    true // isDoctor = true for doctor
                );
                console.log(`Successfully sent email to doctor: ${doctor.email}`);

                // Mark reminder as sent
                booking.reminderSent = true;
                await booking.save();

                console.log(`Reminder emails sent for booking ${booking._id}`);
            } catch (error) {
                console.error(`Error processing booking ${booking._id}:`, error);
                // Don't mark as sent if there was an error
            }
        }
    } catch (error) {
        console.error('Error in appointment reminder scheduler:', error);
    }
}); 