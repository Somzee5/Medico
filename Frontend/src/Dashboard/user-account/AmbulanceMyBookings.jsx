import useFetchData from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import DoctorCard from "../../components/Doctors/DoctorCard";
import Loading from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";

const AmbulanceMyBookings = () => {
  const handleJoinMeeting = (url) => {
    window.open(url, "_blank");
  };
  const navigate = useNavigate();
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
        navigate('/ambulances')
      } else {
        alert("Error canceling booking: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred");
    }
  };

  const {
    data: appointments,
    loading,
    error,
  } = useFetchData(`${BASE_URL}/users/ambulanceappointments/my-appointments`);
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
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              {/* <th scope="col" className="px-6 py-3">
                Email
              </th> */}
              <th scope="col" className="px-6 py-3">
                Vehicle Number
              </th>
              <th scope="col" className="px-6 py-3">
                Price
              </th>
              <th scope="col" className="px-6 py-3">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3">
                Day
              </th>
              <th scope="col" className="px-6 py-3">
                Cancel
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((item) => (
                <tr key={item._id} className="border-b-2 border-gray-200">
                  <th scope="row" className=" text-gray-900 ap">
                      <img
                        src={item.ambulance.photo}
                        className="w-20 h-10 rounded-full"
                        alt=""
                      />
                  </th>
                  
                  <td className="px-6 py-4 font-bold text-[15px] capitalize text-headingColor">{item.ambulance.name}</td>
                  {/* <td className="px-6 py-4">{item.ambulance.email}</td> */}
                  <td className="px-6 py-4 text-[15px] capitalize text-headingColor">{item.ambulance.vehicleNumber}</td>
                  <td className="px-6 py-4 text-[15px] capitalize text-headingColor">
                    {item.ambulance.basePrice}
                  </td>
                  <td className="px-6 py-4  text-[15px] capitalize text-headingColor">
                    {item.ambulance.phone}
                  </td>
                  <td className="px-6 py-4 text-[15px] capitalize text-headingColor">
                    {item.timeSlot}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[15px] capitalize text-headingColor">
                    {/* {console.log(item)} */}
                    <button
                      className="bg-red-500 text-white font-bold py-1 px-7 rounded shadow border-2 
              border-red-500 hover:bg-transparent hover:text-red-500 transition-all duration-300"
                      onClick={() =>
                        handleCancelBooking(item._id, item.timeSlot)
                      }
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {!loading && !error && appointments.length === 0 && (
        <h2 className="mt-5 text-center  leading-7 text-[20px] font-semibold text-primaryColor">
          You have not book any Ambulance Yet!
        </h2>
      )}
    </div>
  );
};

export default AmbulanceMyBookings;
