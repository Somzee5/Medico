import express from 'express'
import { updateUser, deleteUser, getAllUser, getSingleUser, getUserProfile, getMyAppointments, cancelBooking, getMyAmbulanceAppointments, cancelAmbulanceBooking } from '../Controllers/userController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'
import documentModel from '../models/DocsSchema.js'

const router = express.Router()

// Profile routes
router.get('/profile/me', authenticate, restrict(['patient']), getUserProfile)
router.delete('/profile/me', authenticate, restrict(['patient']), deleteUser)

// Appointment routes
router.delete('/appointments/cancel/:id', cancelBooking);
router.delete('/ambulanceappointments/cancel/:id', cancelAmbulanceBooking);

// Admin routes
router.get('/', authenticate, restrict(['admin']), getAllUser)
router.get('/:id', authenticate, restrict(['patient']), getSingleUser)
router.put('/:id', authenticate, restrict(['patient']), updateUser)

//multer 
import multer from 'multer'

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        return cb(null, "public/docs");
    },
    filename: function(req, file, cb) {
        return cb(null, `${file.originalname}`);
    }
});

const upload = multer({ storage });


router.post('/profile/me/documents/:id',upload.single('file'), async(req,res) =>{
    // console.log(req.params.id)
    // console.log(req.file)
    try {
        // Create a new document in the database with the file path
        
        const id = req.params.id
        const newDocument = await documentModel.create({user:id, images: [req.file.path], name: req.file.filename });
        // console.log("File added to database:", newDocument);
        res.status(200).json({ message: "File uploaded successfully", result:newDocument });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: "Failed to upload file" });
    }
})
router.get('/profile/me/documents/:id',async(req,res)=>{
    try{
        const images = await documentModel.find({user:req.params.id})
        res.status(200).json({images})
    }
    catch(err){
        res.status(400).json({message:`error in multer: ${err}`})
    }
})

export default router;