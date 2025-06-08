import React, { useState } from "react";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import useGetProfile from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Tabs from "./AmbulanceTabs";
import AmbulanceBooking from "./AmbulanceBooking";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
// import ambulanceIcon from "../../assets/images/ambulance-icon.png";

const AmbulanceDashboard = () => {
  // Fetch ambulance profile data
  const { data, loading, error } = useGetProfile(
    `${BASE_URL}/ambulances/profile/me`
  );
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [tab, setTab] = useState("overview");

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/ambulances/${data._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account");
    }
  };

  return (
    <section>
      <div className="max-w-[1170px] px-5 mx-auto">
        {loading && !error && <Loader />}
        {error && !loading && <Error />}
        {!loading && !error && (
          <div className="grid lg:grid-cols-3 gap-[30px] lg:gap-[50px]">
            <Tabs tab={tab} setTab={setTab} />
            {console.log(data)}
            <div className="lg:col-span-2">
              {/* {data?.isApproved === "pending" && (
                <div className="flex p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg">
                  <span className="sr-only">Info</span>
                  <div className="ml-3 text-sm font-medium">
                    Your profile is under review. Complete all details to get approved.
                  </div>
                </div>
              )}
              {data?.isApproved === "cancelled" && (
                <div className="flex p-4 mb-4 text-red-800 bg-red-50 rounded-lg">
                  <span className="sr-only">Info</span>
                  <div className="ml-3 text-sm font-medium">
                    Your application was rejected. You can no longer access this platform.
                  </div>
                </div>
              )} */}

              <div className="mt-8">
                {tab === "overview" && (
                  <div>
                    <div className="flex items-center gap-4 mb-10">
                      <figure className="max-w-[300px] max-h-[300px]">
                        <img src={data?.photo} alt="" className="w-full" />
                      </figure>
                      <div>
                        <h3 className="text-[40px] leading-9 font-bold text-red-600  mt-3 mb-5 capitalize">
                          {data?.name}
                        </h3>
                        <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 lg:text-[20px] lg:leading-6 font-semibold uppercase">
                          {data?.serviceArea}
                        </span>
                        <p className="mt-8 text-headingColor text-[20px] leading-5 lg:text-[20px] font-semibold uppercase border-4 p-2 border-y-gray-50">
                          Vehicle Number:{" "}
                          <span className="font-bold text-red-600">
                            {data?.vehicleNumber}
                          </span>
                        </p>
                        <p className="text-headingColor text-[20px] leading-5 lg:text-[20px] font-semibold uppercase mt-2 border-4 p-2 border-y-gray-50">
                          Base Price:{" "}
                          <span className="font-bold text-green-600">
                            ${data?.basePrice}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <h4 className="text-green-600 text-[28px] font-bold mb-3">
                        Availability
                      </h4>
                      <ul>
                        {data?.availability &&
                          Object.entries(data.availability)
                            .filter(([day, available]) => available) // Filter only available days
                            .map(([day]) => (
                              <li
                                key={day}
                                className="text-[28px] leading-5 font-semibold text-blue-600 mb-7    "
                              >
                                {day}
                              </li>
                            ))}
                      </ul>
                    </div>
                  </div>
                )}

                {tab === "bookings" && (
                  <AmbulanceBooking appointment={data?.appointments} />
                )}
              </div>
            </div>
            <div className="mt-[30px] md:mt-0">
              <button 
                onClick={handleDeleteAccount}
                className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white hover:bg-white hover:text-red-600 border-2 border-red-600"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AmbulanceDashboard;
