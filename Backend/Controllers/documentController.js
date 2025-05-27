import Document from '../models/docsSchema.js'; // Import the Document model (user_doc)
// You might need to import cloudinary here if you intend to delete from Cloudinary when deleting from DB
// import cloudinary from 'cloudinary';
// cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });


export const uploadDocumentDetails = async (req, res) => {
    // This endpoint receives the Cloudinary URL and metadata from the frontend
    const { title, url, public_id, originalFileName } = req.body;
    const userId = req.userId; // Assuming your authentication middleware populates req.userId

    if (!userId || !title || !url || !public_id) {
        return res.status(400).json({ success: false, message: 'Missing required document details (title, url, public_id, originalFileName).' });
    }

    try {
        // Find the user's existing 'user_doc' document
        let userDoc = await Document.findOne({ user: userId });

        if (!userDoc) {
            // If the user doesn't have a 'user_doc' entry yet, create a new one
            userDoc = new Document({
                user: userId,
                files: [{ title, url, public_id, originalFileName }]
            });
        } else {
            // If the user already has a 'user_doc' entry, add the new file to its 'files' array
            // Optional: Check for duplicate public_id to prevent re-adding the exact same file
            const existingFile = userDoc.files.find(file => file.public_id === public_id);
            if (existingFile) {
                return res.status(409).json({ success: false, message: 'Document with this public ID already exists for this user.' });
            }
            userDoc.files.push({ title, url, public_id, originalFileName });
        }

        await userDoc.save();

        res.status(200).json({
            success: true,
            message: 'Document details saved successfully!',
            data: userDoc.files[userDoc.files.length - 1] // Return the newly added file info
        });

    } catch (error) {
        console.error('Error saving document details:', error);
        res.status(500).json({ success: false, message: 'Failed to save document details.', error: error.message });
    }
};

export const getMedicalDocuments = async (req, res) => {
    const userId = req.userId; // Populated by your authentication middleware

    try {
        // Find the 'user_doc' entry for the current user
        const userDocs = await Document.findOne({ user: userId }).select('files'); // Only fetch the 'files' array

        if (!userDocs) {
            return res.status(200).json({ success: true, message: 'No medical documents found for this user.', data: [] });
        }

        res.status(200).json({ success: true, message: 'Medical documents fetched successfully.', data: userDocs.files });

    } catch (error) {
        console.error('Error fetching medical documents:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch medical documents.', error: error.message });
    }
};

export const deleteMedicalDocument = async (req, res) => {
    const { publicId } = req.params; // Expect publicId as a URL parameter
    const userId = req.userId;

    if (!publicId) {
        return res.status(400).json({ success: false, message: 'Missing publicId for deletion.' });
    }

    try {
        const userDoc = await Document.findOne({ user: userId });

        if (!userDoc) {
            return res.status(404).json({ success: false, message: 'No document collection found for this user.' });
        }

        // Filter out the document to be deleted
        const initialLength = userDoc.files.length;
        userDoc.files = userDoc.files.filter(file => file.public_id !== publicId);

        if (userDoc.files.length === initialLength) {
            // If length didn't change, document not found in array
            return res.status(404).json({ success: false, message: 'Document not found in your records.' });
        }

        await userDoc.save();

        // Optional: Delete from Cloudinary as well (uncomment and configure if needed)
        // Ensure 'cloudinary' is imported and configured at the top of this file
        // await cloudinary.uploader.destroy(publicId);
        // console.log(`Deleted from Cloudinary: ${publicId}`);

        res.status(200).json({ success: true, message: 'Document deleted successfully.' });

    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ success: false, message: 'Failed to delete document.', error: error.message });
    }
};