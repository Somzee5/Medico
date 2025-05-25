import express from 'express';
import {authenticate} from "./../auth/verifyToken.js";
import { createBooking , newBooking } from '../Controllers/bookingController.js';


const router =express.Router();

// router.post('/checkout-session/:doctorId',authenticate,getCheckoutSession)
router.post('/checkout-session-razorpay/:doctorId',authenticate,createBooking)
router.post('/newbooking',authenticate,newBooking)
// Cancel Booking Route



export default router;