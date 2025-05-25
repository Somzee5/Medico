import User from "../models/UserSchema.js";
import Ambulance from "../models/AmbulanceSchema.js";
import Booking from "../models/BookingSchema.js";
import Razorpay from "razorpay";
import url from "url";
import axios from "axios";
import qs from 'qs'
import AmbulanceBooking from '../models/AmbulanceBookingSchema.js'

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_xc7S1DH28iB6RI",
  key_secret: "26wDD931tPd9pRm9EO0RUDJO",
});

export const createAmbulanceBooking = async (req, res) => {
  const ambulance = await Ambulance.findById(req.params.ambulanceId);
  const user = await User.findById(req.userId);
  const amount = ambulance.basePrice * 100;
  const options = {
    amount: amount,
    currency: "INR",
    receipt: "xyz@gmail.com",
  };

  razorpayInstance.orders.create(options, async (err, order) => {
    if (!err) {
      res.status(200).json({
        success: true,
        message: "Booking Successfull",
        order_id: order.id,
        key_id: "rzp_test_xc7S1DH28iB6RI",
        amount: amount,
        contact: "9876543210",
        name: "xyz",
        email: "abc@gmail.com",
        ambulance: ambulance ? ambulance._id : null,
        user: user ? user._id : null,
        basePrice: ambulance ? ambulance.basePrice : null,
      });
    } else {
      res.status(400).json({ success: false, message: "Something Went Wrong" });
    }
  });
};

// async function refreshAccessToken() {
//   try {

//     const newRefreshToken = response.data.refresh_token;

//     // Update environment variables with new tokens
//     process.env.REACT_APP_ZOOM_AT = newAccessToken;
//     process.env.ZOOM_REFRESH_TOKEN = newRefreshToken;

//     console.log("Access token refreshed successfully");
//   } catch (error) {
//     console.error("Error refreshing access token:");
//     throw error;
//   }
// }


export const AmbulancenewBooking = async (req, res) => {
  const { aid, uid, basePrice, availability } = req.body;
  // console.log(availability)
  try {
    const isAlreadyBooked = await AmbulanceBooking.findOne({
      ambulance: aid,
      timeSlot: availability,
    });

    if (isAlreadyBooked) {
      return res
        .status(400)
        .json({ success: false, message: "Time slot is already booked" });
    }

    // console.log(start_url, join_url);
    // console.log(timeSlot)
    const booking = new AmbulanceBooking({
      ambulance: aid,
      user: uid,
      basePrice: basePrice,
      timeSlot: availability,
    });
    await booking.save();

    // Remove booked time slot from the database
    // await Doctor.findByIdAndUpdate(did, {
    //   $pull: {
    //     timeSlots: {
    //       day: "tuesday",
    //       startingTime: "10:00",
    //       endingTime: "10:30",
    //       _id: "6745e44c518d41082bd80841", // Must match exactly!
    //     },
    //   },
    // });

    // console.log(timeSlot.day)
    // console.log(availability)
    await Ambulance.findByIdAndUpdate(aid,
      {
        $set: {
          [`availability.${availability}`]: false,
        },
      });

    res.status(200).json({ success: true, message: "Booking Done" });
  } catch (error) {
    res.status(400).json({ success: false, message: "Something Went Wrong" });
  }
};



