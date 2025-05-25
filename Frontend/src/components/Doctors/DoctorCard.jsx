import React from "react";
import starIcon from "../../assets/images/Star.png";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";

const DoctorCard = ({ doctor }) => {
  const { name, avgRating, totalRating, photo, specialization, experiences } =
    doctor;

  // return (
  //   <div className="p-3 lg:p-5">
  //     <div>
  //       <img src={photo} className="w-full" />
  //     </div>

  //     <h2 className="text-[18px] leading-[30px] lg:text-[26px] lg:leading-9 text-headingColor font-[700] mt-3 lg:mt-5 ">
  //       {name}
  //     </h2>

  //     <div className="mt-2 lg:mt-4 flex items-center justify-between">
  //       <span className="bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded ">
  //         {specialization}
  //       </span>

  //       <div className="flex items-center gap-[6px] ">
  //         <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] leading-7 font-semibold text-headingColor  ">
  //           <img src={starIcon} />
  //           {avgRating}
  //         </span>
  //         <span className="flex items-center gap-[6px] text-[14px] font-[400] text-textColor ">
  //           ({totalRating})
  //         </span>
  //       </div>
  //     </div>

  //     <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
  //       <div>
  //         {/* <h3 className='text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-headingColor'>
  //              +{totalPatients} patients
  //           </h3> */}
  //         <p className="text-[14px] leading-6 font-[400] text-textColor">
  //           At {experiences && experiences[0]?.hospital}
  //         </p>
  //       </div>

  //       <Link
  //         to={`/doctors/${doctor._id}`}
  //         className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E]  flex items-center justify-center group hover:bg-primaryColor hover:border-none"
  //       >
  //         <BsArrowRight className="group-hover:text-white w-6 h-5" />
  //       </Link>
  //     </div>
  //   </div>
  // );

  // return (
  //   <div className="mb-10 overflow-hidden rounded-lg bg-white shadow-1 duration-300 hover:shadow-3 dark:bg-dark-2 dark:shadow-card dark:hover:shadow-3">
  //     <div className="relative" style={{ height: "200px" }}>
  //       {" "}
  //       {/* Adjust height as needed */}
  //       <img
  //         src={photo}
  //         className="absolute inset-0 w-full h-full object-cover"
  //       />
  //     </div>
  //     <h2 className="mb-4 block text-xl font-semibold text-dark hover:text-black sm:text-[22px] md:text-xl lg:text-[22px] xl:text-xl 2xl:text-[22px]">
  //       {name}
  //     </h2>
  //     <p className="mb-7 text-base leading-relaxed text-body-color dark:text-dark-6">
  //       {specialization}
  //     </p>

  //     <div className="flex items-center gap-[6px] ">
  //       <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px] leading-7 font-semibold text-headingColor  ">
  //         <img src={starIcon} />
  //         {avgRating}
  //       </span>

  //       <span className="flex items-center gap-[6px] text-[14px] font-[400] text-textColor ">
  //         ({totalRating})
  //       </span>

  //       <div className="mt-[18px] lg:mt-5 flex items-center justify-between">
  //         <div>
  //           {/* <h3 className='text-[16px] leading-7 lg:text-[18px] lg:leading-[30px] font-semibold text-headingColor'>
  //             +{totalPatients} patients
  //          </h3> */}
  //           <p className="text-[14px] leading-6 font-[400] text-textColor">
  //             At {experiences && experiences[0]?.hospital}
  //           </p>
  //         </div>
  //         <Link
  //           to={`/doctors/${doctor._id}`}
  //           className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E]  flex items-center justify-center group hover:bg-primaryColor hover:border-none"
  //         >
  //           <BsArrowRight className="group-hover:text-white w-6 h-5" />
  //         </Link>
  //       </div>
  //     </div>
  //   </div>
  // );

  return (
    <div className="mb-2 max-w-[350px] rounded overflow-hidden shadow hover:shadow-lg  bg-[#fafdf6] hover:bg-gray-200">
      <Link to={`/doctors/${doctor._id}`} className="block">
        <img
          alt=""
          src={photo}
          className="h-40 w-full object-cover sm:h-80 lg:h-35 rounded-lg border-[1px] border-gray-300"
        />
        <div className="px-6 py-4 ">
          <h3 className="mt-4 text-lg font-bold text-gray-800 sm:text-xl">
            {name}
          </h3>

          <p className="mt-1 max-w-sm text-gray-600">{specialization}</p>
        </div>
      </Link>
    </div>
  );
};

export default DoctorCard;
