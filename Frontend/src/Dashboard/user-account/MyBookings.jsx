import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import DoctorCard from "../../components/Doctors/DoctorCard";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { formatDate } from "../../utils/formatDate";
import { toast } from "react-toastify";
import { RiDeleteBinFill } from "react-icons/ri";

const MyBookings = () => {
  const handleJoinMeeting = (url) => {
    window.open(url, "_blank");
  };

  const handleCancelBooking = async (bookingId, timeSlot) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/users/appointments/cancel/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Booking canceled successfully");
        window.location.reload(); // Refresh to update the list
      } else {
        toast.error(result.message || "Error canceling booking");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this booking record? This action cannot be undone."
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/users/appointments/delete/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success("Booking record deleted successfully");
        window.location.reload(); // Refresh to update the list
      } else {
        toast.error(result.message || "Error deleting booking record");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred while deleting booking record");
    }
  };

  const {
    data: appointments,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/users/appointments/my-appointments`);
  // console.log(appointments);
  return (
    <div>
      {loading && !error && <Loading />}
      {error && !loading && <Error errMessage={error} />}
      {!loading && !error && (
        // <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        //   {/* {appointments.map((doctor) => (
        //      <DoctorCard doctor={doctor} key={doctor._id} /> patient mkc
        //   ))} */}
        // </div>
        <table className="w-full text-left text-sm text-gray-500 mt-10">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Doctor Name
              </th>
              <th scope="col" className="px-6 py-3">
                Fees
              </th>
              <th scope="col" className="px-6 py-3">
                Schedule
              </th>
              <th scope="col" className="px-6 py-3">
                Meeting Link
              </th>
              <th scope="col" className="px-6 py-3">
                Cancel Appointment
              </th>
              <th scope="col" className="px-6 py-3">
                Delete Record
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((item) => {
              const appointmentStartDate = new Date(item.appointmentStartTime);
              const [endHours, endMinutes] = item.timeSlot.endingTime.split(':').map(Number);
              const appointmentEndDateTime = new Date(
                appointmentStartDate.getFullYear(),
                appointmentStartDate.getMonth(),
                appointmentStartDate.getDate(),
                endHours,
                endMinutes
              );
              const isAppointmentPassed = appointmentEndDateTime < new Date();

              return (
                <tr key={item._id} className="border-b-2 border-gray-200">
                  <th scope="row" className=" text-gray-900 ap">
                    <div className="pl-3">
                      <div className="text-base font-semibold">
                        {item.doctor.name}
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4">{item.ticketPrice}</td>
                  <td className="px-6 py-4">{formatDate(item.appointmentStartTime)}</td>
                  <td className="px-6 py-4">
                    <button
                      className={`bg-blue-500 text-white font-bold py-1 px-8 rounded shadow border-2 
                border-blue-500 ${isAppointmentPassed ? "opacity-50 cursor-not-allowed" : "hover:bg-transparent hover:text-blue-500 transition-all duration-300"}`}
                      onClick={() => handleJoinMeeting(item.join_url)}
                      disabled={isAppointmentPassed}
                    >
                      {" "}
                      Join
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      className={`bg-red-500 text-white font-bold py-1 px-7 rounded shadow border-2 
                border-red-500 ${isAppointmentPassed ? "opacity-50 cursor-not-allowed" : "hover:bg-transparent hover:text-red-500 transition-all duration-300"}`}
                      onClick={() => handleCancelBooking(item._id, item.timeSlot)}
                      disabled={isAppointmentPassed}
                    >
                      Cancel
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {isAppointmentPassed && (
                      <button
                        className="text-red-500 text-2xl hover:text-red-700 transition-all duration-300"
                        onClick={() => handleDeleteBooking(item._id)}
                        title="Delete Record"
                      >
                        <RiDeleteBinFill />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!loading && !error && appointments.length === 0 && (
        <h2 className="mt-5 text-center  leading-7 text-[20px] font-semibold text-primaryColor">
          You have not book any Doctor Yet!
        </h2>
      )}
    </div>
  );
};

export default MyBookings;
