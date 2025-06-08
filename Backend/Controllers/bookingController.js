import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Razorpay from "razorpay";
import url from "url";
import axios from "axios";
import qs from 'qs';
import moment from 'moment-timezone'; // <--- Make sure this is imported
import appointmentScheduler from '../utils/appointmentScheduler.js';

// You DO NOT need to import sendAppointmentReminderEmail here.
// That function is used by the cron job in server.js, not directly by newBooking.

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_xc7S1DH28iB6RI",
  key_secret: "26wDD931tPd9pRm9EO0RUDJO",
});

export const createBooking = async (req, res) => {
    console.log("Attempting to create booking...");
    console.log("Requested doctorId:", req.params.doctorId);
    console.log("Authenticated userId:", req.userId);
  
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId); 
    
    if (!doctor) {
      console.log("Doctor not found for ID:", req.params.doctorId);
      return res.status(404).json({ success: false, message: "Doctor not found." });
    }
    if (!user) { 
      console.log("User not found for ID:", req.userId);
      return res.status(404).json({ success: false, message: "User not found. Please log in." });
    }
  
    if (typeof doctor.ticketPrice !== 'number' || doctor.ticketPrice <= 0) {
      console.error(`Doctor ${doctor._id} has invalid ticketPrice: ${doctor.ticketPrice}`);
      return res.status(400).json({ success: false, message: "Doctor's ticket price is not set or invalid. Cannot initiate booking." });
    }
  
    console.log("Doctor found:", doctor.name);
    console.log("User found:", user.name);
    console.log("Doctor ticketPrice:", doctor.ticketPrice);
    console.log("Calculated amount (ticketPrice * 100):", doctor.ticketPrice * 100);
  
    const amount = doctor.ticketPrice * 100; 
  
    const options = {
      amount: amount, 
      currency: "INR",
      receipt: user.email, 
      notes: {
          doctorId: doctor._id.toString(),
          userId: user._id.toString(),
      }
    };
  
    console.log("Razorpay options being sent:", options);
  
    razorpayInstance.orders.create(options, async (err, order) => {
      if (!err) {
        console.log("Razorpay order created successfully:", order.id);
        res.status(200).json({
          success: true,
          message: "Booking initiated successfully",
          order_id: order.id,
          key_id: "rzp_test_xc7S1DH28iB6RI",
          amount: amount,
          contact: user.phone || "9876543210", 
          name: user.name, 
          email: user.email, 
          doctor: doctor._id,
          user: user._id,
          ticketPrice: doctor.ticketPrice,
        });
      } else {
        console.error("Error creating Razorpay order (from Razorpay callback):", err);
        res.status(500).json({ success: false, message: "Failed to initiate booking. Please try again." });
      }
    });
  };

// async function refreshAccessToken() { /* ... */ } // No changes here

const zoomMeet = async (did, uid, timeSlot) => {
  try {
    const params = new url.URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: `${process.env.ZOOM_REFRESH_TOKEN}`,
    });

    const ATresponse = await axios.post(
      "https://zoom.us/oauth/token",
      params.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${process.env.ZOOM_CLIENT_ID_SECRET_ENCODED}`,
        },
      }
    );

    const newAccessToken = ATresponse.data.access_token;

    const headers = {
      Authorization: `Bearer ${newAccessToken}`,
    };

    // Fetch doctor and patient details
    const doctor = await Doctor.findById(did).select('name');
    const patient = await User.findById(uid).select('name');

    if (!doctor) {
      throw new Error("Doctor not found for Zoom meeting creation");
    }
    if (!patient) {
      throw new Error("Patient not found for Zoom meeting creation");
    }

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDayIndex = daysOfWeek.indexOf(timeSlot.day.toLowerCase());

    if (targetDayIndex === -1) {
        throw new Error(`Invalid day: ${timeSlot.day}`);
    }

    const [startHour, startMinute] = timeSlot.startingTime.split(':').map(Number);

    const now = moment().tz('Asia/Kolkata');
    let meetingMoment = now.clone().day(targetDayIndex);

    if (meetingMoment.isBefore(now, 'day')) {
        meetingMoment.add(1, 'weeks');
    }
    
    meetingMoment.hour(startHour).minute(startMinute).second(0).millisecond(0);

    if (meetingMoment.isBefore(now)) {
        meetingMoment.add(1, 'weeks');
    }
    
    const zoomStartTime = meetingMoment.toISOString();
    const meetingDuration = 30;

    console.log(`Calculated Zoom meeting time: ${zoomStartTime}`);

    const response = await axios({
      method: "post",
      url: "https://api.zoom.us/v2/users/me/meetings",
      headers,
      data: {
        topic: `Appointment: Dr. ${doctor.name} and ${patient.name}`,
        type: 2,
        start_time: zoomStartTime,
        duration: meetingDuration,
        timezone: 'Asia/Kolkata',
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: true,
          mute_upon_entry: false,
          watermark: false,
          audio: "both",
          auto_recording: "cloud",
        },
      },
    });

    return {
      start_url: `${response.data.start_url}?uname=${encodeURIComponent(doctor.name)}`,
      join_url: response.data.join_url,
      appointmentStartTime: meetingMoment.toDate(),
    };
  } catch (error) {
    console.error("Error in Zoom Meeting creation:", error.response?.data || error.message);
    throw new Error("Failed to create Zoom meeting. Please check Zoom API credentials and limits.");
  }
};

export const newBooking = async (req, res) => {
  const { did, uid, price, timeSlot } = req.body;
  
  if (!timeSlot || !timeSlot.day || !timeSlot.startingTime || !timeSlot.endingTime || !timeSlot._id) {
    return res.status(400).json({ success: false, message: "Invalid time slot data provided (missing day, startingTime, endingTime, or _id)." });
  }

  try {
    const isAlreadyBooked = await Booking.findOne({
      doctor: did,
      "timeSlot.day": timeSlot.day,
      "timeSlot.startingTime": timeSlot.startingTime,
      "timeSlot.endingTime": timeSlot.endingTime,
    });

    if (isAlreadyBooked) {
      return res.status(400).json({ success: false, message: "Time slot is already booked for this doctor." });
    }

    let start_url, join_url, appointmentStartTime;
    try {
      ({ start_url, join_url, appointmentStartTime } = await zoomMeet(did, uid, timeSlot));
    } catch (zoomError) {
      console.error("Error creating Zoom meeting:", zoomError);
      return res.status(500).json({ success: false, message: "Failed to create meeting link. Booking failed." });
    }

    const [user, doctor] = await Promise.all([
      User.findById(uid).select('name email'),
      Doctor.findById(did).select('name email')
    ]);

    if (!user || !doctor) {
      return res.status(404).json({ success: false, message: "User or doctor not found." });
    }

    const booking = new Booking({
      doctor: did,
      user: uid,
      ticketPrice: price,
      timeSlot: {
        day: timeSlot.day,
        startingTime: timeSlot.startingTime,
        endingTime: timeSlot.endingTime,
      },
      appointmentStartTime: appointmentStartTime,
      start_url,
      join_url,
      status: "approved",
      isPaid: true,
      reminderSent: false,
    });

    await booking.save();
    console.log("Booking saved successfully.");

    appointmentScheduler.scheduleAppointment({
      id: booking._id,
      startTime: appointmentStartTime,
      patient: {
        name: user.name,
        email: user.email
      },
      doctor: {
        name: doctor.name,
        email: doctor.email
      },
      zoomJoinUrl: join_url,
      zoomStartUrl: start_url
    });

    await Doctor.findByIdAndUpdate(did, {
      $pull: {
        timeSlots: {
          _id: timeSlot._id,
          day: timeSlot.day,
          startingTime: timeSlot.startingTime,
          endingTime: timeSlot.endingTime,
        }
      }
    }, { new: true });
    console.log(`Time slot ${timeSlot._id} pulled from doctor ${did}`);

    res.status(200).json({ success: true, message: "Booking Done Successfully!" });
  } catch (error) {
    console.error("Error in newBooking:", error);
    res.status(500).json({ success: false, message: "Failed to create booking. Please try again." });
  }
};

export const SendPrescription = async (req, res) => {
  const { url, userId } = req.body; 
  
  try {
    if (!userId || !url) {
        return res.status(400).json({ success: false, message: "Missing userId or prescription URL." });
    }

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
    }

    // Assuming you have an email sending utility
    // For demonstration, let's just log it:
    console.log(`Sending prescription to ${user.email} (User: ${user.name}) at URL: ${url}`);

    // Implement actual email sending logic here, e.g.:
    // await sendPrescriptionEmail(user.email, user.name, url);

    return res.status(200).json({ success: true, message: "Prescription sent successfully." });
  } catch (error) {
    console.error("Error sending prescription:", error);
    return res.status(500).json({ success: false, message: "Failed to send prescription." });
  }
};