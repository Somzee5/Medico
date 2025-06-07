import React, { useState, useEffect } from "react";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";
import useGetProfile from "../../hooks/useFetchData";
import { BASE_URL } from "../../config";
import Tabs from "./Tabs";
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from "../../pages/Doctors/DoctorAbout";
import Profile from "./Profile";
import Appointment from "./Appointment";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { data, loading, error } = useGetProfile(
    `${BASE_URL}/doctors/profile/me`
  );
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const [tab, setTab] = useState("overview");
  
    useEffect(() => {
    // Function to reload the window once
    const reloadWindowOnce = () => {
      window.location.reload();
    };

    // Check if it's the initial render
    if (loading === false && error === false) {
      reloadWindowOnce();
    }
  }, [loading, error])
 

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/doctors/profile/me`, {
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
            <div className="lg:col-span-2">
              {data.isApproved === "pending" && (
                <div className="flex p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg">
                  {/* svg */}
                  <span className="sr-only">Info</span>
                  <div className="ml-3 text-sm font-medium">
                    Complete your profile to get Approved. After completion it
                    will'be Approved
                  </div>
                </div>
              )}
              {data.isApproved === "cancelled" && (
                <div className="flex p-4 mb-4 text-yellow-800 bg-yellow-50 rounded-lg">
                  {/* svg */}
                  <span className="sr-only">Info</span>
                  <div className="ml-3 text-sm font-medium">
                    Your Application is been Rejected. You can no longer access our platform
                  </div>
                </div>
              )}
              
                <div className="mt-8">
                  {tab === "overview" && (
                    <div>
                      <div className="flex items-center gap-4 mb-10">
                        <figure className="max-w-[200px] max-h-[200px]">
                          <img src={data?.photo} alt="" className="w-full" />
                        </figure>
                        <div>
                          <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-6 font-semibold">
                            {data.specialization}
                          </span>
                          <h3 className="text-[22px] leading-9 font-bold text-headingColor mt-3">
                            {data.name}
                          </h3>
                          <div className="flex items-center gap-[6px]">
                            <span className="flex items-center gap-[6px] text-headingColor text-[14px] leading-5 lg:text-[16px] leading-6 font-semibold">
                              <img src={starIcon} alt="" />
                              {data.averageRating}
                            </span>
                            <span className="text-headingColor text-[14px] leading-5 lg:text-[16px] leading-6 font-semibold">
                              ({data.totalRating})
                            </span>
                          </div>
                          <p className="text__para font-[15px] lg:max-w-[390px] leading-6">
                            {data?.bio}
                          </p>
                        </div>
                      </div>
                      <DoctorAbout
                        name={data.name}
                        about={data.about}
                        qualifications={data.qualifications}
                        experiences={data.experiences}
                      />
                    </div>
                  )}

                  {tab === "appointments" && (
                    <Appointment appointment={data.appointments} />
                  )}
                  {tab === "settings" && <Profile doctorData={data} />}
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
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
