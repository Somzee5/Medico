import React, { useEffect, useState } from "react";
import convertTime from "../../utils/convertTime";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";
import { token } from "../../config.js";
import { useNavigate } from "react-router-dom";
import HashLoader from "react-spinners/HashLoader.js";

const SidePanel = ({ doctorId, ticketPrice, timeSlots }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const confirmBooking = (timeSlot) => {
    if (window.confirm("Do you want to confirm booking of the selected time slot?")) {
      setSelectedTimeSlot(timeSlot);
      bookAppointment(timeSlot);
    }
  };

  const bookAppointment = async (timeSlot) => {
    try {
      setLoading(true);
      
      // --- CRITICAL FIX: The first fetch call was missing/commented out! ---
      const res = await fetch(
        `${BASE_URL}/bookings/checkout-session-razorpay/${doctorId}`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Good practice to include this
          },
          // No body needed for this endpoint as per your backend controller
        }
      );
      // --- END CRITICAL FIX ---

      const data = await res.json();
      
      console.log("Response from checkout-session-razorpay:", data); // Added for debugging
      
      if (!res.ok) {
        // If the server responded with an error status (e.g., 400, 500)
        throw new Error(data.message || "Failed to initiate booking. Please try again!");
      }
      setLoading(false);

      if (data.success) {
        var options = {
          key: "" + data.key_id + "",
          amount: "" + data.amount + "",
          currency: "INR",
          name: "" + data.name + "",
          description: "Doctor Appointment Booking", // More descriptive
          image: "https://dummyimage.com/600x400/000/fff",
          order_id: "" + data.order_id + "",
          handler: async function (response) {
            console.log("Razorpay payment response:", response); // Log Razorpay's direct response
            console.log("TimeSlot being sent to newbooking API:", timeSlot);

            const newdata = JSON.stringify({
              did: data.doctor,
              uid: data.user,
              price: data.ticketPrice,
              timeSlot: timeSlot,
            });

            console.log("Data sent to newbooking API (full payload):", newdata);

            try {
              const newBookingRes = await fetch(`${BASE_URL}/bookings/newbooking`, { // Renamed 'res' to 'newBookingRes' for clarity
                method: "post",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: newdata,
              });
              const responseData = await newBookingRes.json(); // Use newBookingRes
              
              console.log("New booking API response:", responseData);
              
              if (responseData.success) {
                toast.success(responseData.message);
                navigate("/checkout-success");
              } else {
                toast.error(responseData.message || "Booking failed after payment. Please contact support.");
              }
            } catch (error) {
              console.error("Error in newbooking API call:", error);
              toast.error("An unexpected error occurred during booking confirmation.");
            }
          },
          prefill: {
            contact: "" + data.contact + "",
            name: "" + data.name + "",
            email: "" + data.email + "",
          },
          notes: {
            description: "Appointment for " + doctorId, // More specific note
          },
          theme: {
            color: "#2300a3",
          },
        };
        
        console.log("Razorpay options being used:", options);
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } else {
        // This branch handles cases where Razorpay order creation failed on backend
        toast.error(data.message || "Failed to initiate payment. Please try again.");
      }
    } catch (err) {
      // This catches errors from the first fetch, or issues before Razorpay.open()
      console.error("Error during appointment booking (overall):", err);
      toast.error(err.message || "An error occurred while preparing your booking.");
      setLoading(false);
    }
  };

  return (
    <div className="shadow-panelShadow p-3 lg:p-5 rounded-md">
      {loading && <HashLoader size={25} color="#0067FF" />} {/* Show loader if loading */}
      <div className="flex items-center justify-between">
        <p className="text__para mt-0 font-semibold">Ticket Price</p>
        <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold">
          {ticketPrice} INR
        </span>
      </div>

      <div className="mt-[30px]">
        <p className="text__para mt-0 font-semibold text-headingColor ">
          Available Time Slots:
        </p>

        <ul className="mt-3">
          {timeSlots?.map((item, index) => (
            <li key={item._id || index} className="flex items-center justify-between mt-2"> {/* Use item._id for key if available */}
              <div className="flex">
                <p className="text-[15px] leading-6 text-textColor font-semibold">
                  {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
                </p>
                <p className="text-[15px] leading-6 text-textColor font-semibold ml-4">
                  {convertTime(item.startingTime)} -{" "}
                  {convertTime(item.endingTime)}
                </p>
              </div>
              {/* Compare by _id for selectedTimeSlot to be accurate after data re-fetch if needed */}
              {selectedTimeSlot && selectedTimeSlot._id === item._id ? (
                <span className="text-green-500 font-semibold">Booked</span>
              ) : (
                <button
                  onClick={() => confirmBooking(item)}
                  className="btn px-1 rounded-md"
                  style={{ width: '70px', height: '40px', marginTop: '20px', padding: '8px 16px' }}
                >
                  Book
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidePanel;