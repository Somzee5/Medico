import mongoose from "mongoose";

const AmbulanceBookingSchema = new mongoose.Schema(
  {
    ambulance: {
      type: mongoose.Types.ObjectId,
      ref: "Ambulance",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    basePrice: { type: String },
    timeSlot: {
        type: String
    }
    // timeSlot: {
    //   type: {
    //     day: { type: String, required: true }, // E.g., "tuesday"
    //     startingTime: { type: String, required: true }, // E.g., "10:00"
    //     endingTime: { type: String, required: true }, // E.g., "10:30"
    //   },
    //   required: true,
    // },
  },
  { timestamps: true }
);

AmbulanceBookingSchema.pre(/^find/, function (next) {
  this.populate("user").populate({
    path: "ambulance",
    select: "name photo vehicleNumber email basePrice phone",
  });
  next();
});

export default mongoose.model("AmbulanceBooking", AmbulanceBookingSchema);
