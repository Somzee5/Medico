import jwt from 'jsonwebtoken'
import Doctor from '../models/DoctorSchema.js'
import User from '../models/UserSchema.js'
import Ambulance from '../models/AmbulanceSchema.js'

export const authenticate = async(req,res,next) => {
    const authToken = req.headers.authorization
    if(!authToken || !authToken.startsWith('Bearer ')){
        return res.status(401).json({success:false , message : "No Token, Authorization Denied"})
    } 
    try{
        const token = authToken.split(" ")[1];
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
        req.userId = decoded.id
        req.role = decoded.role

        // Check if user still exists in database
        let user = null;
        if (decoded.role === 'patient') {
            user = await User.findById(decoded.id);
        } else if (decoded.role === 'doctor') {
            user = await Doctor.findById(decoded.id);
        } else if (decoded.role === 'ambulance_service') {
            user = await Ambulance.findById(decoded.id);
        }

        if (!user) {
            return res.status(401).json({ success: false, message: "User no longer exists" });
        }

        next();
    }
    catch(err){
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({message:"Token is Expired"})
        }
        return res.status(401).json({success:false , message: "Invalid Token"})
    }
};

export const restrict = roles => async(req,res,next) => {
    const userId = req.userId
    let user;

    const patient = await User.findById(userId)
    const doctor = await Doctor.findById(userId)
    const ambulance = await Ambulance.findById(userId)

    if(patient){
        user = patient
    }
    if(doctor){
        user = doctor
    }
    if(ambulance){
        user = ambulance
    }

    if(!roles.includes(user.role)){
        return res.status(401).json({success:false , message:"You're Not Authorized"})
    }
    next();
}