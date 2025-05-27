import express from 'express';
import { uploadDocumentDetails, getMedicalDocuments, deleteMedicalDocument } from '../Controllers/documentController.js';
import { authenticate } from '../auth/verifyToken.js'; // Assuming you have authentication middleware

const router = express.Router();

// Route to save Cloudinary URL and metadata after frontend upload
router.post('/save', authenticate, uploadDocumentDetails);

// Route to get all medical documents for a user
router.get('/', authenticate, getMedicalDocuments);

// Route to delete a specific medical document by its Cloudinary public_id
router.delete('/:publicId', authenticate, deleteMedicalDocument);

export default router;