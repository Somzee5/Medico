import React, { useEffect, useRef, useContext, useState } from "react";
import logo from "../../assets/images/logo2.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { BiMenu } from "react-icons/bi";
import { authContext } from "../../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { NODE_API_URL, DEFAULT_PROFILE_PICTURE } from '../../config';

const nav__links = [
  {
    path: "home",
    display: "Home",
    allowedRoles: ["patient", "doctor", "ambulance_service"]
  },
  {
    path: "doctors",
    display: "Find a Doctor",
    allowedRoles: ["patient"]
  },
  {
    path: "ambulances",
    display: "Find an Ambulance",
    allowedRoles: ["patient"]
  },
  {
    path: "services",
    display: "Services",
    allowedRoles: ["patient", "doctor", "ambulance_service"]
  },
  {
    path: "contact",
    display: "Contact",
    allowedRoles: ["patient", "doctor", "ambulance_service"]
  }
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
                isAvailable: isEngaged, // Swapped to send isEngaged directly
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
            <img src={logo} alt="Logo" className="h-[50px] w-auto" />
          </div>

          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {nav__links
                .filter(link => !link.allowedRoles || link.allowedRoles.includes(role))
                .map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="text-headingColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    >
                      {item.display}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {role === "ambulance_service" && (
            <div className="flex items-center gap-4">
              <span
                className={`text-[16px] font-[700] whitespace-nowrap flex-shrink-0 z-10 ${!isEngaged ? "text-green-600" : "text-red-600"}`}
              >
                {!isEngaged ? "Free" : "Engaged"}
              </span>
              <div className="bauble_box ml-auto">
                <input
                  type="checkbox"
                  id="availability"
                  className="bauble_input"
                  checked={!isEngaged}
                  onChange={handleAvailabilityToggle}
                  disabled={isLoading}
                />
                <label htmlFor="availability" className="bauble_label"></label>
              </div>
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
                      src={user?.photo || DEFAULT_PROFILE_PICTURE}
                      className="w-full rounded-full"
                      alt="user"
                    />
                  </figure>
                </Link>

                
                <button
                  onClick={handleLogout}
                  className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]"
                  >Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}

            <span className="md:hidden" onClick={toggleMenu}>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
