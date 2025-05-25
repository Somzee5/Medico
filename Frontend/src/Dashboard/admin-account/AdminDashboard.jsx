import React, { useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import Loading from "./Loading";
// import { setLoading } from "../redux/reducers/rootSlice";
// import { useDispatch, useSelector } from "react-redux";
// import Empty from "./Empty";
// import fetchData from "../helper/apiCall";
// import "../styles/user.css";
import { BASE_URL } from "../../config";
import DoctorApplications from "./DoctorApplications";
import DeleteDoctors from "./DeleteDoctors";
import AdminDeleteUsers from "./AdminDeleteUsers";
// axios.defaults.baseURL = BASE_URL;

const AdminDashboard = () => {
  const [tab, setTab] = useState("Applications");

  //   const dispatch = useDispatch();
  //   const { loading } = useSelector((state) => state.root);

  // const acceptDoctor = async (doctorId) => {
  //   try {
  //     const confirm = window.confirm("Are you sure you want to accept?");
  //     if (confirm) {
  //       await toast.promise(
  //         axios.put(
  //           "/doctor/acceptdoctor",
  //           { id: doctorId },
  //           {
  //             headers: {
  //               authorization: `Bearer ${localStorage.getItem("token")}`,
  //             },
  //             data: { doctorId },
  //           }
  //         ),
  //         {
  //           success: "Application accepted",
  //           error: "Unable to accept application",
  //           loading: "Accepting application...",
  //         }
  //       );
  //       getAllApp();
  //     }
  //   } catch (error) {
  //     return error;
  //   }
  // };

  // useEffect(() => {
  //   getAllApp();
  // }, []);

  return (
    // <>
    //   <section className="user-section">
    //     {applications.length > 0 ? (
    //       <div className="user-container">
    //         <h3 className="home-sub-heading">All Applications</h3>
    //         <table>
    //           <thead>
    //             <tr>
    //               <th>S.No</th>
    //               <th>Pic</th>
    //               <th>Name</th>
    //               <th>Email</th>
    //               <th>Specialization</th>
    //               <th>Qualifications</th>
    //               <th>Experiences</th>
    //               <th>Time Slots</th>
    //               <th>Action</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {applications.map((doctor, index) => (
    //               <tr key={doctor._id}>
    //                 <td>{index + 1}</td>
    //                 <td>
    //                   <img
    //                     className="user-table-pic"
    //                     src={
    //                       doctor.photo ||
    //                       "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    //                     }
    //                     alt={doctor.name}
    //                   />
    //                 </td>
    //                 <td>{doctor.name}</td>
    //                 <td>{doctor.email}</td>
    //                 <td>{doctor.specialization}</td>
    //                 <td>
    //                   <ul>
    //                     {doctor.qualifications.map((qualification, idx) => (
    //                       <li key={idx}>
    //                         {qualification.degree} - {qualification.university}
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 </td>
    //                 <td>
    //                   <ul>
    //                     {doctor.experiences.map((experience, idx) => (
    //                       <li key={idx}>
    //                         {experience.hospital} - {experience.position}
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 </td>
    //                 <td>
    //                   <ul>
    //                     {doctor.timeSlots.map((timeslot, idx) => (
    //                       <li key={idx}>
    //                         {timeslot.day} - {timeslot.startingTime} - {timeslot.endingTime}
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 </td>

    //                 <td className="select">
    //                   <button
    //                     className="btn user-btn accept-btn"
    //                     onClick={() => acceptDoctor(doctor._id)}
    //                   >
    //                     Accept
    //                   </button>
    //                   <button
    //                     className="btn user-btn"
    //                     onClick={() => rejectDoctor(doctor._id)}
    //                   >
    //                     Reject
    //                   </button>
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     ) : (
    //       <div>No Pending Doctors</div>
    //     )}
    //   </section>
    // </>

    // <>
    //   <section className="user-section">
    //     {applications.length > 0 ? (
    //       <div className="user-container">
    //         <h3 className="home-sub-heading">All Applications</h3>
    //         <table className="w-full">
    //           <thead className="text-xs text-gray-700 uppercase bg-gray-50">
    //             <tr>
    //               <th scope="col" className="px-6 py-3">
    //                 S.No
    //               </th>
    //               <th scope="col" className="px-6 py-3">
    //                 Pic
    //               </th>
    //               <th scope="col" className="px-6 py-3">
    //                 Name
    //               </th>
    //               <th scope="col" className="px-6 py-3">
    //                 Email
    //               </th>
    //               <th scope="col" className="px-6 py-3">
    //                 Specialization
    //               </th>
    //               <th scope="col" className="px-6 py-3">
    //                 Qualifications
    //               </th>
    //               <th scope="col" className="px-6 py-3">
    //                 Experiences
    //               </th>
    //               <th scope="col" className="px-6 py-3">
    //                 Time Slots
    //               </th>
    //               <th scope="col" className="px-6 py-3">
    //                 Action
    //               </th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {applications.map((doctor, index) => (
    //               // <tr key={doctor._id}>
    //               //   <td className="px-6 py-4">{index + 1}</td>
    //               //   <td className="px-6 py-4">
    //               //     <img
    //               //       className="w-10 h-10 rounded-full"
    //               //       src={
    //               //         doctor.photo ||
    //               //         "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    //               //       }
    //               //       alt={doctor.name}
    //               //     />
    //               //   </td>
    //               //   <td className="px-6 py-4">{doctor.name}</td>
    //               //   <td className="px-6 py-4">{doctor.email}</td>
    //               //   <td className="px-6 py-4">{doctor.specialization}</td>
    //               //   <td className="px-6 py-4">
    //               //     <ul>
    //               //       {doctor.qualifications.map((qualification, idx) => (
    //               //         <li key={idx}>
    //               //           {qualification.degree} - {qualification.university}
    //               //         </li>
    //               //       ))}
    //               //     </ul>
    //               //   </td>
    //               //   <td className="px-6 py-4">
    //               //     <ul>
    //               //       {doctor.experiences.map((experience, idx) => (
    //               //         <li key={idx}>
    //               //           {experience.hospital} - {experience.position}
    //               //         </li>
    //               //       ))}
    //               //     </ul>
    //               //   </td>
    //               //   <td className="px-6 py-4">
    //               //     <ul>
    //               //       {doctor.timeSlots.map((timeslot, idx) => (
    //               //         <li key={idx}>
    //               //           {timeslot.day} - {timeslot.startingTime} -{" "}
    //               //           {timeslot.endingTime}
    //               //         </li>
    //               //       ))}
    //               //     </ul>
    //               //   </td>
    //               //   <td className="px-6 py-4 flex items-center">
    //               //     <div className="mr-2">
    //               //       <button className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-full mr-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
    //               //         Accept
    //               //       </button>
    //               //     </div>
    //               //     <div>
    //               //       <button className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
    //               //         Reject
    //               //       </button>
    //               //     </div>
    //               //   </td>
    //               // </tr>
    //               <tr
    //                 key={doctor._id}
    //                 className="bg-gray-100 hover:bg-gray-200 border-b border-gray-300"
    //               >
    //                 <td className="px-6 py-4">{index + 1}</td>
    //                 <td className="px-6 py-4">
    //                   <img
    //                     className="w-10 h-10 rounded-full"
    //                     src={
    //                       doctor.photo ||
    //                       "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    //                     }
    //                     alt={doctor.name}
    //                   />
    //                 </td>
    //                 <td className="px-6 py-4 text-gray-800 font-medium">
    //                   {doctor.name}
    //                 </td>
    //                 <td className="px-6 py-4 text-gray-800">{doctor.email}</td>
    //                 <td className="px-6 py-4 text-gray-800">
    //                   {doctor.specialization}
    //                 </td>
    //                 <td className="px-6 py-4 text-gray-800">
    //                   <ul>
    //                     {doctor.qualifications.map((qualification, idx) => (
    //                       <li key={idx} className="mb-1">
    //                         <span className="font-semibold">
    //                           {qualification.degree}
    //                         </span>{" "}
    //                         - {qualification.university}
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 </td>
    //                 <td className="px-6 py-4 text-gray-800">
    //                   <ul>
    //                     {doctor.experiences.map((experience, idx) => (
    //                       <li key={idx} className="mb-1">
    //                         <span className="font-semibold">
    //                           {experience.hospital}
    //                         </span>{" "}
    //                         - {experience.position}
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 </td>
    //                 <td className="px-6 py-4 text-gray-800">
    //                   <ul>
    //                     {doctor.timeSlots.map((timeslot, idx) => (
    //                       <li key={idx} className="mb-1">
    //                         {timeslot.day} - {timeslot.startingTime} -{" "}
    //                         {timeslot.endingTime}
    //                       </li>
    //                     ))}
    //                   </ul>
    //                 </td>
    //                 <td className="px-6 py-4 flex">
    //                   <div className="mr-2">
    //                     <button
    //                       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    //                       onClick={() => acceptDoctor(doctor._id)}
    //                     >
    //                       Accept
    //                     </button>
    //                   </div>
    //                   <div>
    //                     <button
    //                       className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
    //                       onClick={() => rejectDoctor(doctor._id)}
    //                     >
    //                       Reject
    //                     </button>
    //                   </div>
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     ) : (
    //       <div>No Pending Doctors</div>
    //     )}
    //   </section>
    // </>

    <>
      <div className="mt-10 text-center">
        <button
          onClick={() => {
            setTab("Applications");
          }}
          className={`${
            tab === "Applications" && "bg-primaryColor text-white font-normal"
          } p-2 mr-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
        >
          APPLICATIONS
        </button>
        <button
          onClick={() => {
            setTab("Doctors");
          }}
          className={`${
            tab === "Doctors" && "bg-primaryColor text-white font-normal"
          } py-2 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
        >
          DOCTORS
        </button>
        <button
          onClick={() => {
            setTab("Users");
          }}
          className={`${
            tab === "Users" && "bg-primaryColor text-white font-normal"
          } py-2 px-5 ml-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`}
        >
          USERS
        </button>
      </div>
      {tab === "Applications" && <DoctorApplications/>}
      {tab === "Doctors" && <DeleteDoctors/>}
      {tab === "Users" && <AdminDeleteUsers/>}
    </>
  );
};

export default AdminDashboard;
