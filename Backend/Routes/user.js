import express from 'express'
import { updateUser, deleteUser, getAllUser, getSingleUser, getUserProfile, getMyAppointments, cancelBooking, getMyAmbulanceAppointments, cancelAmbulanceBooking, deletePatientBookingPermanently } from '../Controllers/userController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'
import documentModel from '../models/DocsSchema.js'
import multer from 'multer'

const router = express.Router()

// Profile routes
router.get('/profile/me', authenticate, restrict(['patient']), getUserProfile)
router.delete('/profile/me', authenticate, restrict(['patient']), deleteUser)

// Appointment routes
router.get('/appointments/my-appointments', authenticate, restrict(['patient']), getMyAppointments)
router.delete('/appointments/delete/:id', authenticate, restrict(['patient']), deletePatientBookingPermanently)
router.get('/ambulanceappointments/my-appointments', authenticate, restrict(['patient']), getMyAmbulanceAppointments)
router.delete('/appointments/cancel/:id', authenticate, restrict(['patient']), cancelBooking)
router.delete('/ambulanceappointments/cancel/:id', authenticate, restrict(['patient']), cancelAmbulanceBooking)

// Document routes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "public/docs");
    },
    filename: function(req, file, cb) {
        return cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/profile/me/documents/:id', upload.single('file'), async(req, res) => {
    try {
        const id = req.params.id
        const newDocument = await documentModel.create({
            user: id, 
            images: [req.file.path], 
            name: req.file.filename 
        });
        res.status(200).json({ message: "File uploaded successfully", result: newDocument });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Failed to upload file" });
    }
});

router.get('/profile/me/documents/:id', async(req, res) => {
    try {
        const images = await documentModel.find({ user: req.params.id })
        res.status(200).json({ images })
    } catch (err) {
        res.status(400).json({ message: `error in multer: ${err}` })
    }
});

// Admin routes
router.get('/', authenticate, restrict(['admin']), getAllUser)

// User routes (must be after all specific routes)
router.get('/:id', authenticate, restrict(['patient']), getSingleUser)
router.put('/:id', authenticate, restrict(['patient']), updateUser)

export default router;