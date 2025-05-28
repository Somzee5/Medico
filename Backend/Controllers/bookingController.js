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

const zoomMeet = async (did, timeSlot) => { // timeSlot is now passed as an argument
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

    // --- Dynamic Meeting Start Time Calculation ---
    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDayIndex = daysOfWeek.indexOf(timeSlot.day.toLowerCase());

    if (targetDayIndex === -1) {
        throw new Error(`Invalid day: ${timeSlot.day}`);
    }

    const [startHour, startMinute] = timeSlot.startingTime.split(':').map(Number);

    const now = moment().tz('Asia/Kolkata'); // IMPORTANT: Set your application's timezone
    let meetingMoment = now.clone().day(targetDayIndex);

    // If the target day is in the past compared to today's day of week, move to next week
    // or if it's the same day but the time has already passed, move to next week.
    // This logic ensures we always pick a future occurrence of the slot.
    if (meetingMoment.isBefore(now, 'day')) {
        meetingMoment.add(1, 'weeks');
    }
    
    // Set the specific time
    meetingMoment.hour(startHour).minute(startMinute).second(0).millisecond(0);

    // If, after setting hour/minute, the meetingMoment is still in the past (e.g., booking 10 AM Monday on Monday 11 AM), move to next week.
    if (meetingMoment.isBefore(now)) {
        meetingMoment.add(1, 'weeks');
    }
    
    const zoomStartTime = meetingMoment.toISOString(); // ISO 8601 format with Z for UTC or offset
    const meetingDuration = 30; // Assuming 30 minutes, adjust as per your time slots

    console.log(`Calculated Zoom meeting time: ${zoomStartTime}`);
    // --- End Dynamic Meeting Start Time Calculation ---

    const response = await axios({
      method: "post",
      url: "https://api.zoom.us/v2/users/me/meetings",
      headers,
      data: {
        topic: `Appointment with Dr. ${did}`, // Consider fetching doctor's name from DB for better topic
        type: 2, // Scheduled meeting
        start_time: zoomStartTime, // Use the dynamically calculated time
        duration: meetingDuration, 
        timezone: 'Asia/Kolkata', // IMPORTANT: Specify the timezone for the meeting
        settings: {
          host_video: true,
          participant_video: true, 
          join_before_host: true,
          mute_upon_entry: false,
          watermark: false,
          audio: "both", // 'both' for telephone and VoIP
          auto_recording: "cloud",
        },
      },
    });

    return {
      start_url: response.data.start_url,
      join_url: response.data.join_url,
      appointmentStartTime: meetingMoment.toDate(), // <--- ADDED: Return the calculated Date object
    };
  } catch (error) {
    console.error("Error in Zoom Meeting creation:", error.response?.data || error.message);
    throw new Error("Failed to create Zoom meeting. Please check Zoom API credentials and limits.");
  }
};



export const newBooking = async (req, res) => {
  const { did, uid, price, timeSlot } = req.body;
  
  // Validate incoming timeSlot structure
  if (!timeSlot || !timeSlot.day || !timeSlot.startingTime || !timeSlot.endingTime || !timeSlot._id) {
    return res.status(400).json({ success: false, message: "Invalid time slot data provided (missing day, startingTime, endingTime, or _id)." });
  }

  try {
    // 1. Check if the specific day and time slot is already booked
    const isAlreadyBooked = await Booking.findOne({
      doctor: did,
      "timeSlot.day": timeSlot.day,
      "timeSlot.startingTime": timeSlot.startingTime,
      "timeSlot.endingTime": timeSlot.endingTime,
    });

    if (isAlreadyBooked) {
      return res.status(400).json({ success: false, message: "Time slot is already booked for this doctor." });
    }

    // 2. Create Zoom meeting
    let start_url, join_url, appointmentStartTime;
    try {
      ({ start_url, join_url, appointmentStartTime } = await zoomMeet(did, timeSlot));
    } catch (zoomError) {
      console.error("Error creating Zoom meeting:", zoomError);
      return res.status(500).json({ success: false, message: "Failed to create meeting link. Booking failed." });
    }

    // 3. Get user and doctor details for the scheduler
    const [user, doctor] = await Promise.all([
      User.findById(uid).select('name email'),
      Doctor.findById(did).select('name email')
    ]);

    if (!user || !doctor) {
      return res.status(404).json({ success: false, message: "User or doctor not found." });
    }

    // 4. Create the new booking document
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

    // 5. Schedule appointment reminders
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

    // 6. Remove booked time slot from the doctor's available timeSlots
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
  const { url, userId } = req.body; // Assuming userId is passed from the frontend/dashboard
  
  try {
    if (!userId || !url) {
        return res.status(400).json({ success: false, message: "Missing userId or prescription URL." });
    }
    
    const user = await User.findById(userId);
    if (!user || !user.phone) {
        return res.status(404).json({ success: false, message: "User not found or phone number is missing." });
    }

    var data = qs.stringify({
      "token": "4bydc6l3yqn14na9",
      "to": `91${user.phone}`, // Use user's actual phone number (assuming India code 91)
      "filename": "Prescription.pdf",
      "document": url,
      "caption": "Team-MediEase"
    });

    var config = {
      method: 'post',
      url: 'https://api.ultramsg.com/instance77224/messages/document',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        res.status(200).json({ success: true, message: "Prescription sent Successfully" })
      })
      .catch(function (error) {
        console.error("Error sending prescription:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "Prescription not sent" })
      });
  }
  catch (err) {
    console.error("Error in SendPrescription:", err);
    res.status(500).json({ message: `Error processing prescription: ${err.message}` })
  }
}