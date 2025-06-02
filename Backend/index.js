import express from "express"
import cookieParser from "cookie-parser"
import cors from 'cors' // Ensure cors is imported if not already
import mongoose from "mongoose"
import dotenv from 'dotenv'
import authRoute from './Routes/auth.js'
import userRoute from './Routes/user.js'
import doctorRoute from './Routes/doctor.js'
import reviewRoute from './Routes/review.js'
import bookingRoute from './Routes/booking.js';
import adminRoute from './Routes/admin.js';
import ambulanceRoute from './Routes/ambulance.js';
import documentRoute from './Routes/document.js';
import './utils/scheduler.js'; // Import the scheduler

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Define your allowed origins for CORS
const allowedOrigins = [
    'http://localhost:5173', // For your local frontend development
    'https://mediease-frontend-app.onrender.com' // Your deployed frontend URL
    // Add any other specific origins if needed in the future
];

// CORS Options configuration
const corsOption = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or if the origin is in our allowedOrigins list
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Important for handling cookies, authorization headers, etc.
};

// to access docs    --multer
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send("Api is working");
})

mongoose.set('strictQuery', false)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            // useNewUrlParser : true, // These options are no longer necessary in recent Mongoose versions
            // useUnifiedTopology : true
        })
        console.log(`MongoDB Database Connected`);
    }
    catch (err) {
        console.log(err);
    }
}

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption)); // Apply the configured corsOption
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/reviews', reviewRoute);
app.use("/api/v1/bookings", bookingRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/ambulances", ambulanceRoute);
app.use("/api/v1/documents", documentRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is Running on Port ${PORT}`)
})