import express from 'express'
import { getnotdoctors , acceptdoctor, rejectdoctor, deleteDoctorAdmin, getappdoctors } from '../Controllers/doctorController.js';
import { authenticate , restrict } from '../auth/verifyToken.js';
import { deleteuseradmin, getusers } from '../Controllers/userController.js';

const router = express.Router();
router.get('/getnotdoctors', getnotdoctors);
router.get('/getusers', getusers);
router.get('/getappdoctors', getappdoctors);
router.put('/acceptdoctor' , acceptdoctor);
router.put('/rejectdoctor' , rejectdoctor);
router.delete('/deletedoctor', deleteDoctorAdmin);
router.delete('/deleteuser', deleteuseradmin);

export default router;