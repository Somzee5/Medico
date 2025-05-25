import { useContext } from "react";
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import useGetProfile from '../../hooks/useFetchData.jsx';
import { BASE_URL } from "../../config.js";

const Tabs = ({ tab, setTab }) => {
  const { dispatch } = useContext(authContext);
  const navigate = useNavigate();

  const { data, loading, error } = useGetProfile(
    `${BASE_URL}/doctors/profile/me`
  );

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <div>
      <span className="lg:hidden">
        <BiMenu className="w-6 h-6 cursor-pointer" />{" "}
      </span>
      <div className="hidden lg:flex flex-col p-[30px] bg-white shadow-panelShadow items-center h-max rounded-md">
        <button
          onClick={() => setTab("overview")}
          className={`${
            tab === "overview"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md shadow-sm`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab("appointments")}
          className={`${
            tab === "appointments"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md shadow-sm`}
          disabled={data && (data.isApproved === 'cancelled' || data.isApproved === 'pending')}
        >
          {data && (data.isApproved === 'cancelled' || data.isApproved === 'pending') ? 
            <p className="cursor-not-allowed">Appointments</p> : 
            <p>Appointments</p>}
        </button>
        <button
          onClick={() => setTab("settings")}
          className={`${
            tab === "settings"
              ? "bg-indigo-100 text-primaryColor"
              : "bg-transparent text-headingColor"
          } w-full btn mt-0 rounded-md shadow-sm`}
        >
          Profile
        </button>
        <Link to="/doctors/profile/me/prescription">
          <button 
            className="mt-10 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 
            border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300">
            Create Prescription
          </button>
        </Link>
        <Link to="/doctors/profile/me/sendprescription">
          <button 
            className="mt-10 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 
            border-blue-500 hover:bg-transparent hover:text-blue-500 transition-all duration-300">
            Send Prescription
          </button>
        </Link>
        <div className="mt-[50px] w-full">
          <button
            onClick={handleLogout}
            className="w-full bg-[#181A1E] p-3 text-[16px] leading-7 rounded-md text-white"
          >
            Logout
          </button>
          <button className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
