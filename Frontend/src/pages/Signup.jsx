import React, { useState } from "react";
import signupImg from "../assets/images/signup.gif";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/images/doctor-img01.png";
import uploadImageToCloudinary from "../utils/uploadCloudinary";
import { BASE_URL, DEFAULT_PROFILE_PICTURE } from "../config";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const Signup = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(" ");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: selectedFile,
    gender: "",
    role: "patient",
    bloodType: "",
    phone: "",
    vehicleNumber: "",
    availability: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    },
    serviceArea: "",
    basePrice: 0,

    latitude: null,
    longitude: null,

  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name in formData.availability) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        availability: {
          ...prevFormData.availability,
          [name]: checked,
        },
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === "number" ? parseFloat(value) : value,
      });
    }
  };

  const handleFileInputChange = async (event) => {
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);
    setPreviewURL(data.url);
    setSelectedFile(data.url);
    setFormData({ ...formData, photo: data.url });
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
  
    setFormData((prevFormData) => {
      const updatedForm = {
        ...prevFormData,
        role: newRole,
      };
  
      if (newRole === "ambulance_service") {
        updatedForm.vehicleNumber = "";
        updatedForm.availability = {
          Monday: false,
          Tuesday: false,
          Wednesday: false,
          Thursday: false,
          Friday: false,
          Saturday: false,
          Sunday: false,
        };
        updatedForm.serviceArea = "";
        updatedForm.basePrice = 0;
        updatedForm.latitude = null;  // reset location fields
        updatedForm.longitude = null;
      }
  
      // Reset location fields for other roles (optional)
      if (newRole !== "ambulance_service" && newRole !== "doctor") {
        updatedForm.latitude = null;
        updatedForm.longitude = null;
      }
  
      return updatedForm;
    });
  
    // If the role is doctor or ambulance_service, get location
    if (newRole === "doctor" || newRole === "ambulance_service") {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setFormData((prev) => ({
              ...prev,
              latitude,
              longitude,
            }));
            toast.success("Location fetched successfully!");
          },
          (error) => {
            toast.error("Location access denied or unavailable");
            console.error("Geolocation error:", error);
          }
        );
      } else {
        toast.error("Geolocation is not supported by this browser.");
      }
    }
  };
  
  
  
  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const { message } = await res.json();
      if (!res.ok) {
        throw new Error(message);
      }

      setLoading(false);
      toast.success(message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <section className="px-5 xl:px-0">
      <div className="max-w-[1170px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="hidden lg:block bg-primaryColor rounded-l-lg">
            <figure className="rounded-l-lg">
              <img
                src={signupImg}
                alt="Signup Image"
                className="w-full rounded-l-lg"
              />
            </figure>
          </div>

          <div className="rounded-l-lg lg:pl-16 py-10">
            <h3 className="text-headingColor text-22 leading-9 font-bold">
              Create an <span className="text-primaryColor">account</span>
            </h3>

            <form onSubmit={submitHandler}>
              {/* Full Name */}
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border rounded"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border rounded"
                />
              </div>

              {/* Password */}
              <div className="mb-5">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border rounded"
                />
              </div>


              {/* Role */}
              <div className="mb-5">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  className="w-full px-4 py-4 border rounded"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="ambulance_service">Ambulance Service</option>
                </select>
              </div>


              {/* Gender */}
              <div className="mb-5">
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Phone */}
              <div className="mb-5">
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-4 border rounded"
                />
              </div>

              {/* Blood Type for Patient */}
              {formData.role === "patient" && (
                <div className="mb-5">
                  <label className="block mb-2 text-gray-700 font-medium">Select Blood Type</label>
                  <div className="grid grid-cols-4 gap-3">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, bloodType: type })}
                        className={`py-2 px-3 rounded-lg border font-medium text-sm transition 
                          ${
                            formData.bloodType === type
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-800 border-gray-300 hover:border-blue-400"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}


              

              {/* Ambulance-specific fields */}
              {formData.role === "ambulance_service" && (
                <>
                  <div className="mb-5">
                    <input
                      type="text"
                      name="vehicleNumber"
                      placeholder="Vehicle Number"
                      value={formData.vehicleNumber}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 border rounded"
                    />
                  </div>

                  <div className="mb-5">
                    <input
                      type="text"
                      name="serviceArea"
                      placeholder="Service Area"
                      value={formData.serviceArea}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 border rounded"
                    />
                  </div>

                  <div className="mb-5">
                    <input
                      type="number"
                      name="basePrice"
                      placeholder="Base Price"
                      value={formData.basePrice}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-4 border rounded"
                    />
                  </div>

                  <div className="mb-5">
                    <p className="mb-2 font-semibold">Availability:</p>
                    {Object.keys(formData.availability).map((day) => (
                      <label key={day} className="mr-4">
                        <input
                          type="checkbox"
                          name={day}
                          checked={formData.availability[day]}
                          onChange={handleInputChange}
                        />{" "}
                        {day}
                      </label>
                    ))}
                  </div>
                </>
              )}

            {formData.role === "doctor" && (
              <div className="mb-5">
                <p className="text-sm text-gray-600">
                  Location: {formData.latitude}, {formData.longitude}
                </p>
              </div>
            )}

              {/* Photo Upload */}
              <div className="mb-5 flex items-center gap-3">
                <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                  <img
                    src={previewURL || DEFAULT_PROFILE_PICTURE}
                    alt=""
                    className="w-full rounded-full"
                  />
                </figure>

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


              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primaryColor text-white py-3 rounded font-semibold"
              >
                {loading ? <HashLoader size={25} color="#fff" /> : "Sign Up"}
              </button>
            </form>

            <p className="mt-5 text-center text-textColor">
              Already have an account?{" "}
              <Link to="/login" className="text-primaryColor font-medium">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
