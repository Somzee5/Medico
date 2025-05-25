import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import AmbulanceBooking from "../models/AmbulanceBookingSchema.js";
import Ambulance from "../models/AmbulanceSchema.js"

export const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const UpdatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Successfully Updated",
      data: updateUser,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to Update" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to Delete" });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id).select("-password");
    res.status(200).json({ success: true, message: "User Found", data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "No User Found" });
  }
};

export const getAllUser = async (req, res) => {
  const id = req.params.id;

  try {
    const users = await User.find({}).select("-password");
    res
      .status(200)
      .json({ success: true, message: "Users Found", data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Not Found" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    const { password, ...rest } = user._doc;
    return res
      .status(200)
      .json({ success: true, message: "Profile Info", data: { ...rest } });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).populate({
      path: "doctor",
      select: "-password name email photo",
    });
    // const doctorIds = bookings.map(el => el.doctor.id)
    // const doctors = await Doctor.find({_id: {$in:doctorIds}}).select('-password')
    // console.log(bookings);

    res
      .status(200)
      .json({ success: true, message: "Getting Appointments", data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something Went Wrong" });
  }
};

export const getMyAmbulanceAppointments = async (req, res) => {
  try {
    const ambulancebookings = await AmbulanceBooking.find({ user: req.userId }).populate({
      path: "ambulance",
      select: "-password name email photo basePrice phone",
    });
    // const doctorIds = bookings.map(el => el.doctor.id)
    // const doctors = await Doctor.find({_id: {$in:doctorIds}}).select('-password')
    // console.log(ambulancebookings);

    res
      .status(200)
      .json({ success: true, message: "Getting Bookings", data: ambulancebookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something Went Wrong" });
  }
};

export const getusers = async (req, res) => {
  try {
    const users = await User.find({
      role: "patient",
    }).select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ success: false, message: "Not Found" });
  }
};

export const deleteuseradmin = async (req, res) => {
  const id = req.body.id;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Successfully Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to Delete" });
  }
};

export const cancelBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // console.log(booking.doctor._id)
    // console.log(booking.timeSlot)
    const result = await Doctor.findByIdAndUpdate(booking.doctor._id, {
      $push: { timeSlots: booking.timeSlot },
    });
    // console.log(result)
    await Booking.findByIdAndDelete(bookingId);

    res
      .status(200)
      .json({ success: true, message: "Booking canceled successfully." });
  } catch (error) {
    console.error("Error canceling booking:", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred while canceling." });
  }
};

export const cancelAmbulanceBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await AmbulanceBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    const ambulanceId = booking.ambulance._id; 
    const dayToUpdate = booking.timeSlot;

    if (!dayToUpdate) {
      return res.status(400).json({ success: false, message: "Day not specified in booking" });
    }

    const result = await Ambulance.findByIdAndUpdate(
      ambulanceId,
      {
        $set: { [`availability.${dayToUpdate}`]: true },
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: "Ambulance not found" });
    }

    await AmbulanceBooking.findByIdAndDelete(bookingId);

    res.status(200).json({
      success: true,
      message: `Availability updated for ${dayToUpdate}. Booking canceled successfully.`,
      updatedAmbulance: result,
    });
  } catch (error) {
    console.error("Error updating availability and canceling booking:", error);
    res
      .status(500)
      .json({ success: false, message: "An error occurred while processing the request." });
  }

};

