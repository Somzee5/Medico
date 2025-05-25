import React from "react";
import { formatDate } from "../../utils/formatDate";
import { BASE_URL } from "../../config";

const Appointment = ({ appointment }) => {
  const handleJoinMeeting = (url) => {
    window.open(url, "_blank");
  };

  const handleCancelBooking = async (bookingId, timeSlot) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;
    try {
      const response = await fetch(
        `${BASE_URL}/users/appointments/cancel/${bookingId}`,
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
            Payment
          </th>
          <th scope="col" className="px-6 py-3">
            Price
          </th>
          <th scope="col" className="px-6 py-3">
            Booked On
          </th>
          <th scope="col" className="px-6 py-3">
            Start URL
          </th>
          <th scope="col" className="px-6 py-3">
            Cancel Appointment
          </th>
        </tr>
      </thead>

      <tbody>
        {appointment?.map((item) => (
          <tr key={item._id} className="shadow">
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
            <td className="px-6 py-4">
              {item.isPaid && (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                  Paid
                </div>
              )}
              {!item.isPaid && (
                <div className="flex items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                  UnPaid
                </div>
              )}
            </td>
            <td className="px-6 py-4">{item.ticketPrice}</td>
            <td className="px-6 py-4">{formatDate(item.createdAt)}</td>
            <td className="px-6 py-4">
              <button
                className="mt-auto bg-blue-500 text-white font-bold py-1 px-8 rounded shadow border-2 
              border-blue-500 hover:bg-transparent hover:text-blue-500 teansition-all duration-300"
                onClick={() => handleJoinMeeting(item.start_url)}
              >
                {" "}
                Start
              </button>
            </td>
            <td className="px-6 py-4">
                  {/* {console.log(item)} */}
                  <button
                    className="bg-red-500 text-white font-bold py-1 px-7 rounded shadow border-2 
              border-red-500 hover:bg-transparent hover:text-red-500 transition-all duration-300"
                    onClick={() => handleCancelBooking(item._id, item.timeSlot)}
                  >
                    Cancel
                  </button>
                </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Appointment;
