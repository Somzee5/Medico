import React from "react";
import { formatDate } from "../../utils/formatDate";
import { BASE_URL } from "../../config";

const AmbulanceBooking = ({ appointment }) => {
  const handleJoinMeeting = (url) => {
    window.open(url, "_blank");
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;
    try {
      const response = await fetch(
        `${BASE_URL}/users/ambulanceappointments/cancel/${bookingId}`,
        {
          method: "DELETE",
        }
      );
      const result = await response.json();
      if (result.success) {
        alert("Booking canceled successfully");
      } else {
        alert("Error canceling booking: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred");
    }
  };
  return (
    <table className="w-full text-left text-sm text-gray-500 shadow-lg px-4 p-2">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Gender
          </th>
          <th scope="col" className="px-6 py-3">
            Day
          </th>
          <th scope="col" className="px-6 py-3">
            Vehice Number
          </th>
          <th scope="col" className="px-6 py-3">
            Booked On
          </th>
          <th scope="col" className="px-6 py-3">
            Cancel Booking
          </th>
        </tr>
      </thead>

      <tbody>
        {console.log(appointment)}
        {appointment?.map((item) => (
          <tr key={item._id} className="shadow">
            {console.log(item)}
            <th
              scope="row"
              className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap "
            >
              <img
                src={item.user.photo}
                className="w-10 h-10 rounded-full"
                alt=""
              />
              <div className="pl-3">
                <div className="text-base font-semibold">{item.user.name}</div>
                <div className="text-normal text-gray-500">
                  {item.user.email}
                </div>
              </div>
            </th>
            <td className="px-6 py-4">{item.user.gender}</td>
            <td className="px-6 py-4">{item.timeSlot}
            </td>
            <td className="px-6 py-4 uppercase">{item.ambulance.vehicleNumber}</td>
            <td className="px-6 py-4">{formatDate(item.createdAt)}</td>

            <td className="px-6 py-4">
                  {/* {console.log(item)} */}
                  <button
                    className="bg-red-500 text-white font-bold py-1 px-7 rounded shadow border-2 
              border-red-500 hover:bg-transparent hover:text-red-500 transition-all duration-300"
                    onClick={() => handleCancelBooking(item._id, item.timeSlot)}
                  >
                    X
                  </button>
                </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AmbulanceBooking;
