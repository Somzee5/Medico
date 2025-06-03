import { useContext, useState, useEffect } from "react";
import { authContext } from "../../context/AuthContext";
import MyBookings from "./MyBookings";
import Profile from "./Profile.jsx";
import useGetProfile from "../../hooks/useFetchData.jsx";
import { BASE_URL } from "../../config";
import Loading from "../../components/Loader/Loading.jsx";
import Error from "../../components/Error/Error.jsx";
import { Link } from "react-router-dom";
import AmbulanceMyBookings from "./AmbulanceMyBookings.jsx";

const MyAccount = () => {
  const { dispatch } = useContext(authContext);
  const [tab, setTab] = useState("appointments");
  const {
    data: userData,
    loading,
    error,
  } = useGetProfile(`${BASE_URL}/users/profile/me`);

  

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };
  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto shadow-lg p-2">
        {loading && !error && <Loading />}
        {error && !loading && <Error errMessage={error} />}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            <div className="pb-[50px] px-[30px] rounded-md">
              <div className="flex items-center justify-center">
                <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                  <img
                    src={userData.photo}
                    alt=""
                    className="w-full h-full rounded-full"
                  />
                </figure>
              </div>
              <div className="text-center mt-4">
                <h3 className="text-[18px] leading-[30px] text-headingColor font-bold">
                  {userData.name}
                </h3>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                {userData.email}
                </p>
                <p className="text-textColor text-[15px] leading-6 font-medium">
                  Blood Type :{" "}
                  <span className="ml-2 text-headingColor text-[22px] leading-8">
                  {userData.bloodType}
                  </span>
                </p>
              </div>


              {/* document upload button */}
              <Link to="/users/profile/me/documents">
              <button  
              className="w-full bg-blue-500 p-3 text-[16px] leading-7 rounded-md text-white hover:bg-white hover:text-blue-500 border-2 border-blue-500 my-2"
              >
                  Upload Documents
              </button>
              </Link>

              <Link to={'/users/profile/me'}>
                <button className="w-full bg-blue-500 p-3 text-[16px] leading-7 rounded-md text-white hover:bg-white hover:text-blue-500 border-2 border-blue-500 my-2">
                  Profile
                </button>
              </Link>

              <div className="mt-[50px] md:mt-[100px]">
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white hover:bg-white border-2 border-[#181A1E] hover:text-[#181A1E]"
                >
                  Logout
                </button>
                <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white hover:bg-white hover:text-red-600 border-2 border-red-600">
                  Delete Account
                </button>
              </div>
            </div>
            <div className="md:col-span-2 md:px-[30px]">
              <div>
                <button
                  onClick={() => {
                    setTab("appointments");
                  }}
                  className={`${
                    tab === "appointments" &&
                    "bg-primaryColor text-white font-normal"
                  } p-2 mr-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
                >
                  My Appointments
                </button>
                <button
                  onClick={() => {
                    setTab("bookings");
                  }}
                  className={`${
                    tab === "bookings" &&
                    "bg-primaryColor text-white font-normal"
                  } p-2 mr-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
                >
                  My Bookings
                </button>
                <button
                  onClick={() => {
                    setTab("settings");
                  }}
                  className={`${
                    tab === "settings" &&
                    "bg-primaryColor text-white font-normal"
                  } py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
                >
                  Profile Settings
                </button>
              </div>
              {tab === "appointments" && <MyBookings />}
              {tab === "bookings" && <AmbulanceMyBookings />}
              {tab === "settings" && <Profile user = {userData}/>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAccount;
