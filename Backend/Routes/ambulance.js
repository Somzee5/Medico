import express from 'express'
import { getSingleAmbulance, getAllAmbulance, deleteAmbulance, getAmbulanceProfile, updateAvailabilityAndLocation,getNearbyAmbulances, updateAmbulance } from '../Controllers/ambulanceController.js'
import { authenticate, restrict } from '../auth/verifyToken.js'
import { createAmbulanceBooking, AmbulancenewBooking } from '../Controllers/ambulanceBookingController.js'

const router = express.Router()

router.get('/:id', getSingleAmbulance)
router.get('/', getAllAmbulance)
router.put('/:id', authenticate, restrict(['ambulance_service']), updateAmbulance)
router.delete('/:id', authenticate, restrict(['ambulance_service']), deleteAmbulance)
router.get('/profile/me', authenticate, restrict(['ambulance_service']), getAmbulanceProfile)
router.delete('/profile/me', authenticate, restrict(['ambulance_service']), deleteAmbulance)
router.post('/bookings/checkout-session-razorpay/:ambulanceId',authenticate,createAmbulanceBooking)
router.post('/bookings/newbooking',authenticate,AmbulancenewBooking)
router.patch('/availability', authenticate, restrict(['ambulance_service']), updateAvailabilityAndLocation)
router.post('/nearby',  getNearbyAmbulances)
export default router