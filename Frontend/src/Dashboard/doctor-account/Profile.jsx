import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
// Profile.jsx

import  uploadImageToCloudinary  from '../../../src/utils/uploadCloudinary.js';
import { BASE_URL,token, DEFAULT_PROFILE_PICTURE } from "./../../config.js";
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader'
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";


const Profile = ({doctorData}) => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: 0,
    qualifications: [
      { startingDate: "", endingDate: "", degree: "", university: "" },
    ],
    experiences: [
      { startingDate: "", endingDate: "", position: "", hospital: "" },
    ],
    timeSlots: [],
    about: "",
    photo: DEFAULT_PROFILE_PICTURE,
    yearofRegistartion: "",
    registrationNumber: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (doctorData) {
      setFormData({
        name: doctorData.name || "",
        email: doctorData.email || "",
        phone: doctorData.phone || "",
        bio: doctorData.bio || "",
        gender: doctorData.gender || "",
        specialization: doctorData.specialization || "",
        ticketPrice: doctorData.ticketPrice || 0,
        qualifications: doctorData.qualifications && doctorData.qualifications.length > 0 ? doctorData.qualifications : [{ startingDate: "", endingDate: "", degree: "", university: "" }],
        experiences: doctorData.experiences && doctorData.experiences.length > 0 ? doctorData.experiences : [{ startingDate: "", endingDate: "", position: "", hospital: "" }],
        timeSlots: doctorData.timeSlots || [],
        about: doctorData.about || "",
        photo: doctorData.photo || DEFAULT_PROFILE_PICTURE,
        yearofRegistartion: doctorData.yearofRegistartion || "",
        registrationNumber: doctorData.registrationNumber || "",
      });
    }
  }, [doctorData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileInputChange = async event => {
    const file = event.target.files[0];
    if (file) {
      const data = await uploadImageToCloudinary(file);
      if (data?.url) {
        setFormData(prev => ({ ...prev, photo: data.url }));
      }
    }
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const res = await fetch(`${BASE_URL}/doctors/${doctorData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      setLoading(false);
      toast.success(result.message);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  const addItem = (key, item) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: [...prevFormData[key], item],
    }));
  };


  //reusable input change
const handleReusableInputChangeFunc=(key,index,event)=>{

  const {name,value}=event.target


  setFormData(prevFormData=>{
    const updateItems=[...prevFormData[key]]

    updateItems[index][name]=value

    return{
      ...prevFormData,
      [key]:updateItems,
    }
  })
}

//reusable function for deleting item
const deleteItem=(key,index)=>{
  setFormData(prevFormData=>({...prevFormData,[key]:prevFormData[key].filter((_,i)=>i!==index)}));
};

  const addQualification = (e) => {
    e.preventDefault();
    addItem("qualifications", {
      startingDate: "",
      endingDate: "",
      degree: "",
      university: "",
    });
  };

  const handleQualificationChange=(event,index)=>{
    handleReusableInputChangeFunc('qualifications',index,event)
  };

  const deleteQualification =(e,index)=>{
    e.preventDefault()
    deleteItem('qualifications',index)
  };


  const addExperience = (e) => {
    e.preventDefault();
    addItem("experiences", {
       startingDate: "", endingDate: "", position: "", hospital: "" 
    });
  };

  const handleExperienceChange=(event,index)=>{
    handleReusableInputChangeFunc('experiences',index,event)
  };

  const deleteExperience =(e,index)=>{
    e.preventDefault()
    deleteItem('experiences',index)
  };

   const addTimeSlot = (e) => {
    e.preventDefault();
    addItem("timeSlots", {
      day: "", startingTime: "", endingTime: "" 
    });
  };

  const handleTimeSlotChange=(event,index)=>{
    handleReusableInputChangeFunc('timeSlots',index,event)
  };

  const deleteTimeSlot =(e,index)=>{
    e.preventDefault()
    deleteItem('timeSlots',index)
  };

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
    <div className="shadow-lg p-3 px-4">
      <h2 className="text-headingColor font-bold text-[24px] leding-9 mb-10">
        Profile Information
      </h2>

      {/* --- FORM SECTION --- */}
      <form>
        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              <img src={formData.photo} alt="" className="w-full rounded-full" />
            </figure>
          )}

          <div className="relative w-[130px] h-[50px]">
            <input
              type="file"
              name="photo"
              id="photo"
              onChange={handleFileInputChange}
              accept=".jpg, .png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="photo"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.5rem] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>
        <div className="mb-5">
          <p className="form__label">Name</p>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Full Name"
            className="form__input"
          />
        </div>
        <div className="mb-5">
          <p className="form__label">Email</p>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="form__input cursor-not-allowed"
            readOnly
            aria-readonly
            
          />
        </div>

        <div className="mb-5">
          <p className="form__label">Phone Number</p>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone Number"
            className="form__input"
          />
        </div>
        <div className="mb-5">
          <p className="form__label">Bio</p>
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Bio"
            className="form__input"
          />
        </div>
        <div className="mb-5">
          <p className="form__label">Gender</p>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="form__input py-3.5"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="mb-5">
          <p className="form__label">Specialization</p>
          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleInputChange}
            className="form__input py-3.5"
          >
            <option value="">Select</option>
            <option value="surgeon">Surgeon</option>
            <option value="neurologist">Neurologist</option>
            <option value="dermatologist">Dermatologist</option>
          </select>
        </div>
        <div className="mb-5">
          <p className="form__label">Ticket Price</p>
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleInputChange}
            placeholder="Ticket Price"
            className="form__input"
          />
        </div>

        <div className="mb-5">
          <p className="form__label">About</p>
          <textarea
            name="about"
            value={formData.about}
            onChange={handleInputChange}
            placeholder="Write about yourself"
            className="form__input"
            rows="5"
          ></textarea>
        </div>

        <div className="mb-5">
          <p className="form__label">Year of Registration</p>
          <input
            type="text"
            name="yearofRegistartion"
            value={formData.yearofRegistartion}
            onChange={handleInputChange}
            placeholder="Year of Registration"
            className="form__input"
          />
        </div>

        <div className="mb-5">
          <p className="form__label">Registration Number</p>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleInputChange}
            placeholder="Registration Number"
            className="form__input"
          />
        </div>


        <div className="mb-5">
          <div className="flex items-center justify-between">
            <p className="form__label">Qualifications</p>
            <button onClick={addQualification} className="bg-primaryColor py-2 px-5 rounded text-white h-8 cursor-pointer text-sm">
              Add Qualification
            </button>
          </div>

          {formData.qualifications?.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-5 mt-5">
              <div>
                <p className="form__label">Starting Date</p>
                <input
                  type="date"
                  name="startingDate"
                  value={item.startingDate}
                  onChange={(e) => handleQualificationChange(e, index)}
                  className="form__input"
                />
              </div>
              <div>
                <p className="form__label">Ending Date</p>
                <input
                  type="date"
                  name="endingDate"
                  value={item.endingDate}
                  onChange={(e) => handleQualificationChange(e, index)}
                  className="form__input"
                />
              </div>
              <div>
                <p className="form__label">Degree</p>
                <input
                  type="text"
                  name="degree"
                  value={item.degree}
                  onChange={(e) => handleQualificationChange(e, index)}
                  placeholder="Degree"
                  className="form__input"
                />
              </div>
              <div>
                <p className="form__label">University</p>
                <input
                  type="text"
                  name="university"
                  value={item.university}
                  onChange={(e) => handleQualificationChange(e, index)}
                  placeholder="University"
                  className="form__input"
                />
              </div>
              <div className="flex items-center mt-2">
                <button onClick={(e)=>deleteQualification(e,index)} className="bg-red-600 p-2 rounded-full text-white text-[18px] cursor-pointer">
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between">
            <p className="form__label">Experiences</p>
            <button onClick={addExperience} className="bg-primaryColor py-2 px-5 rounded text-white h-8 cursor-pointer text-sm">
              Add Experience
            </button>
          </div>

          {formData.experiences?.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-5 mt-5">
              <div>
                <p className="form__label">Starting Date</p>
                <input
                  type="date"
                  name="startingDate"
                  value={item.startingDate}
                  onChange={(e) => handleExperienceChange(e, index)}
                  className="form__input"
                />
              </div>
              <div>
                <p className="form__label">Ending Date</p>
                <input
                  type="date"
                  name="endingDate"
                  value={item.endingDate}
                  onChange={(e) => handleExperienceChange(e, index)}
                  className="form__input"
                />
              </div>
              <div>
                <p className="form__label">Position</p>
                <input
                  type="text"
                  name="position"
                  value={item.position}
                  onChange={(e) => handleExperienceChange(e, index)}
                  placeholder="Position"
                  className="form__input"
                />
              </div>
              <div>
                <p className="form__label">Hospital</p>
                <input
                  type="text"
                  name="hospital"
                  value={item.hospital}
                  onChange={(e) => handleExperienceChange(e, index)}
                  placeholder="Hospital"
                  className="form__input"
                />
              </div>
              <div className="flex items-center mt-2">
                <button onClick={(e)=>deleteExperience(e,index)} className="bg-red-600 p-2 rounded-full text-white text-[18px] cursor-pointer">
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between">
            <p className="form__label">Time Slots</p>
            <button onClick={addTimeSlot} className="bg-primaryColor py-2 px-5 rounded text-white h-8 cursor-pointer text-sm">
              Add Time Slot
            </button>
          </div>

          {formData.timeSlots?.map((item, index) => (
            <div key={index} className="grid grid-cols-2 gap-5 mt-5">
              <div>
                <p className="form__label">Day</p>
                <select
                  name="day"
                  value={item.day}
                  onChange={(e) => handleTimeSlotChange(e, index)}
                  className="form__input py-3.5"
                >
                  <option value="">Select</option>
                  <option value="sunday">Sunday</option>
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                  <option value="saturday">Saturday</option>
                </select>
              </div>
              <div>
                <p className="form__label">Starting Time</p>
                <input
                  type="time"
                  name="startingTime"
                  value={item.startingTime}
                  onChange={(e) => handleTimeSlotChange(e, index)}
                  className="form__input"
                />
              </div>
              <div>
                <p className="form__label">Ending Time</p>
                <input
                  type="time"
                  name="endingTime"
                  value={item.endingTime}
                  onChange={(e) => handleTimeSlotChange(e, index)}
                  className="form__input"
                />
              </div>
              <div className="flex items-center mt-2">
                <button onClick={(e)=>deleteTimeSlot(e,index)} className="bg-red-600 p-2 rounded-full text-white text-[18px] cursor-pointer">
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <button
            type="submit"
            onClick={updateProfileHandler}
            className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 rounded-lg hover:bg-irisBlueColor"
          >
            {loading ? <HashLoader size={25} color="#ffffff" /> : "Update Profile"}
          </button>
        </div>
      </form>

      {/* --- DOCTOR PROFILE DISPLAY SECTION --- */}
      <div className="doctor-profile-display-section mt-10 p-4 border border-gray-200 rounded-lg shadow-sm">
        {/* Profile Header: Image, Specialization, Name, Ratings */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
          <figure className="w-[120px] h-[120px] rounded-full border-2 border-primaryColor flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={doctorData?.photo || DEFAULT_PROFILE_PICTURE} alt="Doctor" className="w-full h-full object-cover" />
          </figure>
          <div className="flex flex-col">
            <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-4 lg:py-2 lg:px-6 rounded text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold mb-2">
              {doctorData?.specialization || "N/A"}
            </span>
            <h3 className="text-headingColor text-[24px] leading-9 font-bold">
              {doctorData?.name || "N/A"}
            </h3>
            {/* Assuming rating goes here if available from doctorData */}
            {doctorData?.avgRating !== undefined && doctorData.totalRating !== undefined && (
              <div className="flex items-center gap-[6px] mt-2">
                <span className="flex items-center gap-[6px] text-yellowColor text-[16px] leading-6 font-semibold">
                  <img src="/path/to/star-icon.png" alt="Star" className="w-5 h-5" /> { /* Placeholder for star icon */}
                  {doctorData.avgRating.toFixed(1)}
                </span>
                <span className="text-[15px] leading-6 font-[400] text-textColor">
                  ({doctorData.totalRating})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* About section */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className="text-headingColor text-[20px] leading-9 font-bold mb-4">
            About of {doctorData?.name || "N/A"}
          </h3>
          <p className="text__para leading-7 text-textColor">{doctorData?.about || "No information available."}</p>
        </div>

        {/* Education section */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className="text-headingColor text-[20px] leading-9 font-bold mb-4">
            Education
          </h3>
          <ul className="list-disc pl-5 pt-4"> { /* Added list-disc and pl-5 for standard list styling */}
            {formData.qualifications?.map((item, index) => (
              <li key={index} className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-5 p-3 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex-grow">
                  <h4 className="text-[16px] leading-6 font-semibold text-irisBlueColor mb-1">
                    {formatDate(item.startingDate)} - {formatDate(item.endingDate)}
                  </h4>
                  <p className="text-[15px] leading-6 font-[500] text-textColor">
                    {item.degree}
                  </p>
                </div>
                <p className="text-[15px] leading-6 font-[500] text-textColor text-right sm:text-left">
                  {item.university}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience section */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <h3 className="text-headingColor text-[20px] leading-9 font-bold mb-4">
            Experience
          </h3>
          <ul className="grid sm:grid-cols-2 gap-4 pt-4">
            {formData.experiences?.map((item, index) => (
              <li key={index} className="p-4 rounded bg-[#fff9ea] border border-yellowColor shadow-sm">
                <span className="text-yellowColor text-[16px] leading-6 font-semibold block mb-2">
                  {formatDate(item.startingDate)} - {formatDate(item.endingDate)}
                </span>
                <p className="text-[15px] leading-6 font-[500] text-textColor">
                  {item.position}
                </p>
                <p className="text-[15px] leading-6 font-[500] text-textColor mt-1">
                  {item.hospital}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* Delete Account Button */}
      <div className="mt-10 text-center">
        <button
          onClick={handleDeleteAccount}
          className="bg-red-600 text-white font-[600] h-[48px] flex items-center justify-center rounded-lg px-8 py-2 mx-auto hover:bg-red-700 transition-all duration-200"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Profile;
