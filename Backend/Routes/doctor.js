import express from 'express'
import { updateDoctor, deleteDoctor, getAllDoctor, getSingleDoctor, getDoctorProfile, deleteDoctorBookingPermanently } from '../Controllers/doctorController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'
import reviewRouter from './review.js'
import { SendPrescription } from '../Controllers/bookingController.js'
import { searchDoctors } from '../Controllers/doctorController.js' // or doctorController



const router = express.Router()

router.use('/:doctorId/reviews', reviewRouter)

router.get('/:id', getSingleDoctor)
router.get('/', getAllDoctor)
router.put('/:id', authenticate, restrict(['doctor']), updateDoctor)
router.delete('/:id', authenticate, restrict(['doctor']), deleteDoctor)

router.get('/profile/me', authenticate, restrict(['doctor']), getDoctorProfile)
router.delete('/profile/me', authenticate, restrict(['doctor']), deleteDoctor)
router.delete('/appointments/delete/:id', authenticate, restrict(['doctor']), deleteDoctorBookingPermanently)

router.post('/profile/me/sendprescription', authenticate, restrict(['doctor']), SendPrescription)
router.post("/search", searchDoctors);
export default router;