import AmbulanceBooking from "../models/AmbulanceBookingSchema.js"
import Ambulance from "../models/AmbulanceSchema.js"



// PATCH - Update ambulance availability and location
export const updateAvailabilityAndLocation = async (req, res) => {
    try {
        const ambulanceId = req.userId; // Comes from middleware
        const { isAvailable, latitude, longitude } = req.body;

        const ambulance = await Ambulance.findById(ambulanceId);

        if (!ambulance) {
            return res.status(404).json({ success: false, message: "Ambulance not found" });
        }

        if (ambulance.role !== "ambulance_service") {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        ambulance.isAvailable = isAvailable;

        if (latitude && longitude) {
            ambulance.location = {
                type: "Point",
                coordinates: [longitude, latitude], // GeoJSON format: [lng, lat]
            };
        }

        await ambulance.save();

        res.status(200).json({
            success: true,
            message: "Availability and location updated successfully",
            data: ambulance,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const getNearbyAmbulances = async (req, res) => {
    try {
        const { latitude, longitude, maxDistance = 10000 } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required",
            });
        }

        // Get today's day in lowercase format matching your availability keys
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = days[new Date().getDay()];

        // Filter ambulances by availability today and general availability
        const baseFilter = {
            isAvailable: true,
            [`availability.${today}`]: true,  // dynamic field for today's availability
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: maxDistance,
                },
            },
        };

        const nearbyAmbulances = await Ambulance.find(baseFilter);

        res.status(200).json({
            success: true,
            message: "Nearby ambulances fetched successfully",
            data: nearbyAmbulances,
        });
    } catch (error) {
        console.error("Error fetching nearby ambulances:", error);
        res.status(500).json({
            success: false,
            message: "Server error while fetching nearby ambulances",
        });
    }
};








export const deleteAmbulance = async (req, res) => {
    try {
        // If deleting through profile/me, use req.userId
        // If deleting through admin or direct ID, use req.params.id
        const id = req.params.id || req.userId;
        
        if (!id) {
            return res.status(400).json({ success: false, message: 'No ambulance ID provided' });
        }

        // Delete all bookings associated with this ambulance
        await AmbulanceBooking.deleteMany({ ambulance: id });
        
        // Delete the ambulance
        const deletedAmbulance = await Ambulance.findByIdAndDelete(id);
        
        if (!deletedAmbulance) {
            return res.status(404).json({ success: false, message: 'Ambulance not found' });
        }

        res.status(200).json({ success: true, message: 'Successfully Deleted' });
    }
    catch (err) {
        console.error('Error deleting ambulance:', err);
        res.status(500).json({ success: false, message: 'Failed to Delete' });
    }
}

export const deleteAmbulanceAdmin = async (req, res) => {
    const id = req.body.id
    try {
        await Ambulance.findByIdAndDelete(id)
        res.status(200).json({ success: true, message: 'Successfully Deleted' })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Failed to Delete' })
    }
}

export const getSingleAmbulance = async (req, res) => {
    const id = req.params.id
    try {
        const ambulance = await Ambulance.findById(id).select("-password")
        res.status(200).json({ success: true, message: 'Ambulance Found', data: ambulance })
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'No Doctor Found' })
    }
}

export const getAllAmbulance = async (req, res) => {
    try {
      const { query } = req.query;
  
      // Get today's day in lowercase (e.g., "monday", "tuesday", etc.)
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = days[new Date().getDay()];
  
      // Base filter: must be available and available today
      const baseFilter = {
        isAvailable: true,
        [`availability.${today}`]: true,
      };
  
      let ambulances;
  
      if (query) {
        ambulances = await Ambulance.find({
          ...baseFilter,
          serviceArea: { $regex: query, $options: "i" },
        }).select("-password");
      } else {
        ambulances = await Ambulance.find(baseFilter).select("-password");
      }
  
      res.status(200).json({
        success: true,
        message: "Available ambulances found for today",
        data: ambulances,
      });
  
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong. Could not fetch ambulances.",
      });
    }
  };

export const getAmbulanceProfile = async (req, res) => {
    const ambulanceId = req.userId
    try {
        const ambulance = await Ambulance.findById(ambulanceId)
        if (!ambulance) {
            return res.status(404).json({ success: false, message: 'Ambulance Not Found' })
        }
        const { password, ...rest } = ambulance._doc;
        const appointments = await AmbulanceBooking.find({ ambulance: ambulanceId })


        return res.status(200).json({ success: true, message: 'Profile Info', data: { ...rest, appointments } })
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Something Went Wrong' })

    }
}



