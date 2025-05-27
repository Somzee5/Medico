import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticketPrice: { type: Number, required: true },
    appointmentStartTime: { // This will store the exact Date/Time of the meeting
      type: Date,
      required: true,
  },
  // --- NEW FIELD FOR SCHEDULING REMINDERS ---
  reminderSent: { // To track if reminder has been sent for this booking
      type: Boolean,
      default: false,
  },
    timeSlot: {
      type: {
        day: { type: String, required: true }, // E.g., "tuesday"
        startingTime: { type: String, required: true }, // E.g., "10:00"
        endingTime: { type: String, required: true }, // E.g., "10:30"
      },
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "cancelled"],
      default: "pending",
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    join_url: {
      type: String,
    },
    start_url: {
      type: String,
    },
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "doctor",
    select: "name",
  });
  next();
});

export default mongoose.model("Booking", bookingSchema);
