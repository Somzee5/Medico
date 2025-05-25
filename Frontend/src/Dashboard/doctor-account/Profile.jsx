import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
// Profile.jsx

import  uploadImageToCloudinary  from '../../../src/utils/uploadCloudinary.js';
import { BASE_URL,token } from "./../../config.js";
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader'




const Profile = ({doctorData}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password:"",
    phone: "",
    bio: "",
    gender: "",
    specialization: "",
    ticketPrice: 0,
    qualifications: [
      { startingDate: "", endingDate: "", degree: "", university: "" },
    ],
    experiences: [
       { startingDate: "", endingDate: "", degree: "", university: "" },
    ],
    timeSlots: [],
    about: "",
    photo: null,
    yearofRegistartion:"",
    registrationNumber:"",
  });
  const [loading,setLoading]=useState(false);

  useEffect(()=>{
       setFormData({
    name: doctorData?.name,
    email: doctorData?.email,
    phone: doctorData?.phone,
    bio: doctorData?.bio,
    gender: doctorData?.gender,
    specialization: doctorData?.specialization,
    ticketPrice: doctorData?.ticketPrice,
    qualifications: doctorData?.qualifications,
    experiences: doctorData?.experiences,
    timeSlots: doctorData?.timeSlots,
    about: doctorData?.about,
    photo: doctorData?.photo,
    yearofRegistartion: doctorData?.yearofRegistartion,
    registrationNumber: doctorData?.registrationNumber,
       })
  },[doctorData])

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileInputChange =async event => {
    const file=event.target.files[0];
    const data=await uploadImageToCloudinary(file);
    // console.log(data);
    setFormData({...formData,photo:data?.url})
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setLoading(true)

    try{
      // console.log(formData)
     const res= await fetch(`${BASE_URL}/doctors/${doctorData._id}`,{
      method:'PUT',
      headers:{
        'content-type':'application/json',
        Authorization:`Bearer ${token}`
      },
      body:JSON.stringify(formData)
     })

     const result=await res.json();
    //  console.log(result)
     if(!res.ok){
      throw Error(result.message);
     }
     setLoading(false)
     toast.success(result.message);
    }
    catch(err){
       toast.error(err.message);
       setLoading(false)
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
  setFormData(prevFormData=>({...prevFormData,[key]:[...prevFormData[key].filter((_,i)!=index)]}));
};

  const addQualification = (e) => {
    e.preventDefault();
    addItem("qualifications", {
      startingDate: "",
      endingDate: "",
      degree: "PHD",
      university: "Medical College",
    });
  };

  const handleQualificationChange=(event,index)=>{
    handleReusableInputChangeFunc('qualifications',index,event)
  };

  const deleteQualification =(e,index)=>{
    e.preventDefault()
    deleteItem('qualification',index)
  };


  const addExperience = (e) => {
    e.preventDefault();
    addItem("experiences", {
       startingDate: "", endingDate: "", position: "Senior Surgeon", hospital: "Medical College" 
    });
  };

  const handleExperienceChange=(event,index)=>{
    handleReusableInputChangeFunc('experiences',index,event)
  };

  const deleteExperience =(e,index)=>{
    e.preventDefault()
    deleteItem('qualification',index)
  };

   const addTimeSlot = (e) => {
    e.preventDefault();
    addItem("timeSlots", {
      day: "Sunday", startingTime: "10:00", endingTime: "04:30" 
    });
  };

  const handleTimeSlotChange=(event,index)=>{
    handleReusableInputChangeFunc('timeSlots',index,event)
  };

  const deleteTimeSlot =(e,index)=>{
    e.preventDefault()
    deleteItem('qualification',index)
  };


  return (
    <div className="shadow-lg p-3 px-4">
      <h2 className="text-headingColor font-bold text-[24px] leding-9 mb-10">
        Profile Information
      </h2>
      <form>
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
          <p className="form__label">Phone</p>
          <input
            type="number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="phone number"
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
            placeholder="Bio number"
            className="form__input"
            maxLength={100}
          />
        </div>
        <div className="mb-5">
          <div className="grid grid-cols-3 gap-5 mb-[30px]">
            <div>
              <p className="form__label">Gender</p>
              <select
                className="form__input py-3.5"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="Select">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <p className="form__label">Specialization</p>
              <select
                className="form__input py-2.5"
                name="specialization"
                value={formData.specialization}
                onChange={handleInputChange}
              >
                <option value="Select">Select</option>
                <option value="surgeon">Surgeon</option>
                <option value="neurologist">Neurologist</option>
                <option value="dermatologist">Dermatologist</option>
              </select>
            </div>
            <div>
              <p className="form__label">Ticket Price</p>
              <input
                type="number"
                placeholder="100"
                name="ticketPrice"
                value={formData.ticketPrice}
                className="form__input"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 mb-[30px]">
            <div>
              <p className="form__label">Year of Registration</p>
              {/* <select
                className="form__input py-3.5"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="Select">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="other">Other</option>
              </select> */}
              <input
                type="number"
                placeholder="2000"
                name="yearofRegistartion"
                value={formData.yearofRegistartion}
                className="form__input"
                onChange={handleInputChange}
              />

            </div>
            <div>
              <p className="form__label">Registration Number</p>
              <input
                type="number"
                placeholder=""
                name="registrationNumber"
                value={formData.registrationNumber}
                className="form__input"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="mb-5">
          <p className="form__label">Qualifications</p>
          {formData.qualifications?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form__label">
                      Starting Date*
                      <input
                        type="date"
                        name="startingDate"
                        value={item.startingDate}
                        className="form__input"
                        onChange={e=>handleQualificationChange(e,index)}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="form__label">
                      Ending Date*
                      <input
                        type="date"
                        name="endingDate"
                        value={item.endingDate}
                        className="form__input"
                         onChange={e=>handleQualificationChange(e,index)}
                      />
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form__label">
                      Degree*
                      <input
                        type="text"
                        name="degree"
                        value={item.degree}
                        className="form__input"
                         onChange={e=>handleQualificationChange(e,index)}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="form__label">
                      University*
                      <input
                        type="text"
                        name="university"
                        value={item.university}
                        className="form__input"
                         onChange={e=>handleQualificationChange(e,index)}
                      />
                    </p>
                  </div>
                </div>
                <button onClick={deleteQualification} className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer">
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addQualification}
            className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer"
          >
            Add Qualification
          </button>
        </div>
        <div className="mb-5">
          <p className="form__label">Experiences</p>
          {formData.experiences?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form__label">
                      Starting Date*
                      <input
                        type="date"
                        name="startingDate"
                        value={item.startingDate}
                        className="form__input"
                        onChange={e=>handleExperienceChange(e,index)}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="form__label">
                      Ending Date*
                      <input
                        type="date"
                        name="endingDate"
                        value={item.endingDate}
                        className="form__input"
                        onChange={e=>handleExperienceChange(e,index)}
                      />
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <p className="form__label">
                      Position*
                      <input
                        type="text"
                        name="position"
                        value={item.position}
                        className="form__input"
                        onChange={e=>handleExperienceChange(e,index)}
                      />
                    </p>
                  </div>
                  <div>
                    <p className="form__label">
                      Hospital*
                      <input
                        type="text"
                        name="hospital"
                        value={item.hospital}
                        className="form__input"
                        onChange={e=>handleExperienceChange(e,index)}
                      />
                    </p>
                  </div>
                </div>
                <button onClick={e=> deleteExperience(e,index)} className="bg-red-600 p-2 rounded-full text-white text-[18px] mt-2 mb-[30px] cursor-pointer">
                  <AiOutlineDelete />
                </button>
              </div>
            </div>
          ))}
          <button onClick={addExperience} className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer">
            Add Experience
          </button>
        </div>
        <div className="mb-5">
          <p className="form__label">Time Slots</p>
          {formData.timeSlots?.map((item, index) => (
            <div key={index}>
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 mb-[30px] gap-5">
                  <div>
                    <p className="form__label">Day*</p>
                    <select
                      name="day"
                      value={item.day}
                      className="form__input py-3.5"
                      onChange={e=>handleTimeSlotChange(e,index)}
                    >
                      <option value="">Select</option>
                      <option value="saturday">Saturday</option>
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                      <option value="tuesday">Tuesday</option>
                      <option value="wednesday">Wednesday</option>
                      <option value="thursday">Thursday</option>
                      <option value="friday">Friday</option>
                    </select>
                  </div>
                  <div>
                    <p className="form__label">Starting Time*</p>
                    <input
                      type="time"
                      name="startingTime"
                      value={item.startingTime}
                      className="form__input"
                       onChange={e=>handleTimeSlotChange(e,index)}
                    />
                  </div>
                  <div>
                    <p className="form__label">Ending Time*</p>
                    <input
                      type="time"
                      name="endingTime"
                      value={item.endingTime}
                      className="form__input"
                       onChange={e=>handleTimeSlotChange(e,index)}
                    />
                  </div>
                  <div>
                    <button onClick={e=>deleteTimeSlot(e,index)} className="bg-red-600 p-2 rounded-full text-white text-[18px]  cursor-pointer mt-6">
                      <AiOutlineDelete />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={addTimeSlot} className="bg-[#000] py-2 px-5 rounded text-white h-fit cursor-pointer">
            Add TimeSlot
          </button>
        </div>
        <div className="mb-5">
          <p className="form__label">About*</p>
          <textarea
            name="about"
            rows="5"
            value={formData.about}
            placeholder="Write About You"
            onChange={handleInputChange}
            className="form__input"
          ></textarea>
        </div>
        <div className="mb-5 flex items-center gap-3">
          {formData.photo && (
            <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
              <img
                src={formData.photo}
                alt=""
                className="w-full rounded-full"
              />
            </figure>
          )}

          <div className="relative w-[130px] h-[50px]">
            <input
              type="file"
              name="photo"
              onChange={handleFileInputChange}
              id="customFile"
              accept=".jpg,.png"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
            <label
              htmlFor="customFile"
              className="absolute top-0 left-0 w-full h-full flex items-center px-[0.75rem] py-[0.375px] text-[15px] leading-6 overflow-hidden bg-[#0066ff46] text-headingColor font-semibold rounded-lg truncate cursor-pointer"
            >
              Upload Photo
            </label>
          </div>
        </div>
        <div className="mt-7">
        <button disabled={loading && true} type='submit' onClick={updateProfileHandler} 
        className="mt-10 bg-blue-500 text-white font-bold py-2 px-8 rounded shadow border-2 
        border-blue-500 hover:bg-transparent hover:text-blue-500 teansition-all duration-300 w-full">
             {loading ? (<HashLoader size={35} color='#ffffff' />) : ("Update Profile")}
            </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
