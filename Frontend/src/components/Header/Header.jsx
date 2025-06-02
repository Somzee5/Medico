import { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/images/logo2.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { NODE_API_URL } from '../../config';

const navLinks = [
  { path: "/home", display: "Home" },
  { path: "/doctors", display: "Find a Doctor" },
  { path: "/ambulances", display: "Find an Ambulance" },
  { path: "/services", display: "Services" },
  { path: "/contact", display: "Contact" },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, role, token, dispatch } = useContext(authContext);
  const navigate = useNavigate();

  const [isEngaged, setIsEngaged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("ambulanceStatus");
    navigate("/");
  };

  const handleStickyHeader = () => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("sticky__header");
      } else {
        headerRef.current.classList.remove("sticky__header");
      }
    });
  };

  useEffect(() => {
    handleStickyHeader();
    return () => window.removeEventListener("scroll", handleStickyHeader);
  }, []);

  // Load previous availability status from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem("ambulanceStatus");
    if (savedStatus !== null) {
      setIsEngaged(savedStatus === "true");
    }
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const handleAvailabilityToggle = () => {
    const newStatus = !isEngaged; // toggling current status
  
    if (navigator.geolocation) {
      setIsLoading(true);
  
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          try {
            const res = await axios.patch(
              `${NODE_API_URL}/ambulances/availability`,
              {
                isAvailable: newStatus, // 🔄 this matches backend schema
                latitude,
                longitude,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
  
            if (res.data.success) {
              setIsEngaged(newStatus);
              localStorage.setItem("ambulanceStatus", newStatus);
              toast.success("Availability status and location updated!");
            } else {
              toast.error("Failed to update availability");
            }
          } catch (err) {
            console.error(err);
            toast.error("Something went wrong while updating availability.");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          toast.error("Unable to access location. Please allow location access.");
          console.error(error);
          setIsLoading(false);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };
  

  return (
    <header className="header flex items-center bg-[#90e0ef]" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          <div>
            <img src={logo} alt="Logo" className="h-[200px] w-[200px]" />
          </div>

          <div className="navigation one" ref={menuRef} onClick={toggleMenu}>
            {role !== "admin" ? (
              <ul className="menu flex items-center gap-[2.7rem]">
                {navLinks.map((link, index) => (
                  <li key={index} id={`step${index}`}>
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        isActive
                          ? "text-primaryColor text-[16px] leading-7 font-[600]"
                          : "text-textColor text-[16px] leading-7 font-[500]"
                      }
                    >
                      {link.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-primaryColor text-center font-bold text-[30px]">
                Welcome to Admin Dashboard
              </p>
            )}
          </div>

          {role === "ambulance_service" && (
  <div className="bauble_box ml-4">
    <input
      type="checkbox"
      id="availability"
      className="bauble_input"
      checked={isEngaged}
      onChange={handleAvailabilityToggle}
      disabled={isLoading}
    />
    <label htmlFor="availability" className="bauble_label"></label>
  </div>
)}


          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="flex items-center" id="step4">
                <Link
                  to={
                    role === "doctor"
                      ? "/doctors/profile/me"
                      : role === "admin"
                      ? "/admin/dashboard"
                      : role === "ambulance_service"
                      ? "/ambulance-service/profile/me"
                      : "/users/profile/me"
                  }
                  className="mr-4"
                >
                  <figure className="w-[35px] h-[35px] rounded-full cursor-pointer">
                    <img
                      src={user?.photo}
                      className="w-full rounded-full"
                      alt="user"
                    />
                  </figure>
                </Link>

                
                {/* <button
                  className="w-full bg-primaryColor p-3 text-[16px] leading-7 rounded-md text-white ml-2"
                  onClick={handleLogout}
                >
                  Logout
                </button> */}
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <BiMenu className="w-6 h-6 cursor-pointer" />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
