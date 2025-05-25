import mongoose from "mongoose";

const AmbulanceSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  photo: { type: String },
  gender: { type: String, enum: ["male", "female", "other"] },
  role: { type: String },
  vehicleNumber: { type: String, required: true, unique: true },
  phone: { type: Number },

  // Day-wise availability
  availability: {
    type: Map,
    of: Boolean,
  },

  // Availability status (free or engaged)
  isAvailable: {
    type: Boolean,
    default: true,
  },

  serviceArea: { type: String, required: true },
  basePrice: { type: Number, required: true },

  // 📍 GeoJSON location (optional, dynamic)
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false,
    },
  },
});

// 📌 Create geospatial index
AmbulanceSchema.index({ location: "2dsphere" });

// ✅ Safe export to avoid OverwriteModelError
export default mongoose.models.Ambulance || mongoose.model("Ambulance", AmbulanceSchema);
