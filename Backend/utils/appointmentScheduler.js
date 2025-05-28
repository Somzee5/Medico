import { sendAppointmentReminderEmail } from './emailSender.js';
import { format } from 'date-fns';

class AppointmentScheduler {
    constructor() {
        this.scheduledJobs = new Map();
    }

    /**
     * Schedule an appointment reminder email
     * @param {Object} appointment - The appointment object
     * @param {string} appointment.id - Unique identifier for the appointment
     * @param {Date} appointment.startTime - The start time of the appointment
     * @param {Object} appointment.patient - Patient information
     * @param {Object} appointment.doctor - Doctor information
     * @param {string} appointment.zoomJoinUrl - Zoom meeting join URL
     * @param {string} appointment.zoomStartUrl - Zoom meeting start URL (for doctor)
     */
    scheduleAppointment(appointment) {
        const { id, startTime, patient, doctor, zoomJoinUrl, zoomStartUrl } = appointment;
        
        // Calculate reminder time (5 minutes before appointment)
        const reminderTime = new Date(startTime.getTime() - 5 * 60 * 1000);
        
        // If the reminder time is in the past, don't schedule
        if (reminderTime <= new Date()) {
            console.log(`Appointment ${id} is too close or in the past, skipping reminder`);
            return;
        }

        // Format the appointment time for the email
        const formattedTime = format(startTime, "EEEE, MMMM d, yyyy, h:mm a");

        // Schedule reminder for patient
        const patientReminder = setTimeout(async () => {
            try {
                await sendAppointmentReminderEmail(
                    patient.email,
                    patient.name,
                    doctor.name,
                    formattedTime,
                    zoomJoinUrl,
                    null,
                    false
                );
            } catch (error) {
                console.error(`Failed to send patient reminder for appointment ${id}:`, error);
            }
        }, reminderTime - new Date());

        // Schedule reminder for doctor
        const doctorReminder = setTimeout(async () => {
            try {
                await sendAppointmentReminderEmail(
                    doctor.email,
                    doctor.name,
                    patient.name,
                    formattedTime,
                    zoomJoinUrl,
                    zoomStartUrl,
                    true
                );
            } catch (error) {
                console.error(`Failed to send doctor reminder for appointment ${id}:`, error);
            }
        }, reminderTime - new Date());

        // Store the timeouts for potential cancellation
        this.scheduledJobs.set(id, {
            patientReminder,
            doctorReminder,
            reminderTime
        });

        console.log(`Scheduled reminders for appointment ${id} at ${reminderTime}`);
    }

    /**
     * Cancel scheduled reminders for an appointment
     * @param {string} appointmentId - The ID of the appointment
     */
    cancelAppointment(appointmentId) {
        const job = this.scheduledJobs.get(appointmentId);
        if (job) {
            clearTimeout(job.patientReminder);
            clearTimeout(job.doctorReminder);
            this.scheduledJobs.delete(appointmentId);
            console.log(`Cancelled reminders for appointment ${appointmentId}`);
        }
    }

    /**
     * Get all scheduled appointments
     * @returns {Array} Array of scheduled appointments with their reminder times
     */
    getScheduledAppointments() {
        return Array.from(this.scheduledJobs.entries()).map(([id, job]) => ({
            appointmentId: id,
            reminderTime: job.reminderTime
        }));
    }
}

// Create a singleton instance
const appointmentScheduler = new AppointmentScheduler();

export default appointmentScheduler; 