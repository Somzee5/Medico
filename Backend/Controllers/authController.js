import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import Ambulance from '../models/AmbulanceSchema.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, {
        expiresIn: '15d',
    });
};

// REGISTER
export const register = async (req, res) => {
    const { email, password, name, role, photo, gender, bloodType, phone, latitude, longitude } = req.body;
  
    try {
      let user = null;
  
      // Check if user already exists based on role
      if (role === 'patient') {
        user = await User.findOne({ email });
      } else if (role === 'doctor') {
        user = await Doctor.findOne({ email });
      } else if (role === 'ambulance_service') {
        user = await Ambulance.findOne({ email });
      }
  
      if (user) {
        return res.status(400).json({ message: 'User Already Exists' });
      }
  
      // Password hashing
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
  
      // Register based on role
      if (role === 'patient') {
        user = new User({
          name,
          email,
          password: hashPassword,
          photo,
          gender,
          role,
          phone,
          bloodType,
        });
      }
  
      if (role === 'doctor') {
        // Ensure latitude and longitude are provided
        if (!latitude || !longitude) {
          return res.status(400).json({ message: 'Doctor location (latitude & longitude) is required' });
        }
  
        user = new Doctor({
          name,
          email,
          password: hashPassword,
          photo,
          gender,
          role,
          phone,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude], // GeoJSON requires [lng, lat]
          },
        });
      }
  
      if (role === 'ambulance_service') {
        const { basePrice, serviceArea, availability, vehicleNumber, latitude, longitude } = req.body;

if (!basePrice || !serviceArea || !vehicleNumber) {
  return res.status(400).json({ message: 'Missing required ambulance fields (basePrice, serviceArea, vehicleNumber)' });
}

const location = (latitude !== undefined && longitude !== undefined)
  ? {
      type: 'Point',
      coordinates: [longitude, latitude],
    }
  : undefined;

user = new Ambulance({
  name,
  email,
  password: hashPassword,
  photo,
  gender,
  role,
  phone,
  basePrice,
  serviceArea,
  availability,
  vehicleNumber,
  isAvailable: false,
  ...(location && { location }),
});

      }
      
      
  
      await user.save();
  
      return res.status(200).json({ success: true, message: 'User Successfully Created' });
  
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  
// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = null;

        const patient = await User.findOne({ email });
        const doctor = await Doctor.findOne({ email });
        const ambulance_service = await Ambulance.findOne({ email });

        if (patient) user = patient;
        if (doctor) user = doctor;
        if (ambulance_service) user = ambulance_service;

        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ status: false, message: 'Invalid Credentials' });
        }

        const token = generateToken(user);

        const { password: pass, role, appointments, ...rest } = user._doc;

        res.status(200).json({
            status: true,
            message: 'Successfully Logged In',
            token,
            data: { ...rest },
            role,
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: 'Failed to Login' });
    }
};
