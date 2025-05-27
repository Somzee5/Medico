import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    // This will store details for each uploaded document.
    // It's an array because a user can upload multiple documents.
    files: [
        {
            title: { type: String, required: true },         // A user-provided title (e.g., "Blood Report 2023")
            url: { type: String, required: true },          // Cloudinary URL of the document
            public_id: { type: String, required: true },    // Cloudinary public ID (for potential deletion or management)
            originalFileName: { type: String },             // The original name of the file
            uploadedAt: { type: Date, default: Date.now }   // Timestamp of upload
        }
    ]
}, { timestamps: true }); // Add timestamps for creation/update dates for the main document entry itself


// After (safe way to export, prevents overwriting):
export default mongoose.models.user_doc || mongoose.model('user_doc', documentSchema);