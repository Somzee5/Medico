import React, { useEffect } from "react";
import heroImg01 from "../../src/assets/images/hero-img01.png";
import heroImg02 from "../../src/assets/images/hero-img02.png";
import heroImg03 from "../../src/assets/images/hero-img03.png";
import HIMG01 from "../../src/assets/images/HIMG01.png";
import HIMG02 from "../../src/assets/images/HIMG02.png";
import HIMG03 from "../../src/assets/images/HIMG03.png";
import HIMG04 from "../../src/assets/images/HIMG04.png";
import HIMG05 from "../../src/assets/images/HIMG05.png";
import icon01 from "../../src/assets/images/icon01.png";
import icon02 from "../../src/assets/images/icon02.png";
import icon03 from "../../src/assets/images/icon03.png";
import ICON01 from "../../src/assets/images/ICON01.webp";
import ICON2 from "../../src/assets/images/ICON2.png";
import ICON03 from "../../src/assets/images/ICON03.webp";
import { Link } from "react-router-dom";
import { BsArrowRight } from "react-icons/bs";
import About from "../components/About/About";
import ServiceList from "../components/Services/ServiceList";
import featureImg from "../../src/assets/images/feature-img.png";
import FEATUREIMG from "../../src/assets/images/FEATUREIMG.jpg";
import videoIcon from "../assets/images/video-icon.png";
import avatarIcon from "../assets/images/avatar-icon.png";
import DoctorList from "../components/Doctors/DoctorList";
import faqImg from "../assets/images/faq-img.png";
import FAQIMG from "../assets/images/FAQIMG.webp";
import FaqList from "../components/Faq/FaqList";
import Testimonial from "../components/Testimonial/Testimonial";

const Home = () => {
  return (
    <div className="bg-[#f5f9fa]">
      {/* hero section */}

    <section className='hero__section pt-[60px] 2xl:h-[800px]'>
      <div className="container flex justify-center mb-0 align-bottom" style={{ alignItems: 'flex-end' }}>
        <img src={HIMG04} alt="" className='h-[250px]'/>
        <img src={HIMG02} alt="" className='h-[300px]'/>
        <img src={HIMG01} alt="" className='h-[400px]'/>
        <img src={HIMG03} alt="" className='h-[300px]'/> 
        <img src={HIMG05} alt="" className='h-[250px]'/>    
      </div>
      <h2 className='font-sans heading text-center text-blue-600 p-5 pb-0'>
      "Your Health, Our Mission"<br /> The Right Platform for Online Doctor Consultation</h2>
    </section>

    {/* hero section end */}

    
    {/* mera code */}
    <section >
      <div className="container">
        <div className='lg:w-[470px] mx-auto'>
          <h2 className='font-sans heading text-center'>Providing the best medical services.
          </h2>
          <p className='text__para text-center'>
            World-class care for everyone. Our health System offers unmatched,
            expert health care.
          </p>
        </div>

        <div className='py-[30px] px-5 flex justify-around border-b-[1px] border-gray-200 hover:shadow-lg'>
            <div>
              <div className='mt-[30px]'>
                <h2 className='font-sans text-[26px] leading-9 text-headingColor font-[700]'>Find a Doctor</h2>
              </div>

              <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center ">
                World-class care for everyone. Our health system offers
                unmatched, expert health care. From the lab to the clinic.
              </p>
            </div>

            <div>
              <div className="flex flex-row items-center justify-center">
                <img src={ICON01} alt="" className="w-[150px] h-[150px]" />
              </div>

              <Link
                to="/doctors"
                className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
              >
                <BsArrowRight className="group-hover:text-white w-6 h-5" />
              </Link>
            </div>
          </div>


        <div className='py-[30px] px-5 flex justify-around border-b-[2px] border-gray-200 hover:shadow-lg'>
            <div>
              <div className='mt-[30px]'>
                <h2 className='font-sans text-[26px] leading-9 text-headingColor font-[700]'>Find a Location</h2>
              </div>

              <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center ">
                Locate nearby hospitals and book ambulances with real-time routes using integrated Google Maps.
              </p>
            </div>

            <div>
              <div className="flex flex-row items-center justify-center">
                <img src={ICON2} alt="" className="h-[150px]" />
              </div>

              <Link
                to="/ambulances"
                className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
              >
                <BsArrowRight className="group-hover:text-white w-6 h-5" />
              </Link>
            </div>
          </div>

        <div className='py-[30px] px-5 flex justify-around hover:shadow-lg'>
            <div>
              <div className='mt-[30px]'>
                <h2 className='font-sans text-[26px] leading-9 text-headingColor font-[700]'>Book Appoinment</h2>
              </div>

              <p className="text-[16px] leading-7 text-textColor font-[400] mt-4 text-center ">
              Schedule appointments with doctors and join consultations directly via Zoom links—no downloads or extra steps required.
              </p>
            </div>

            <div>
              <div className="flex flex-row items-center justify-center">
                <img src={ICON03} alt="" className="h-[200px]" />
              </div>

              <Link
                to="/doctors"
                className="w-[44px] h-[44px] rounded-full border border-solid border-[#181A1E] mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none"
              >
                <BsArrowRight className="group-hover:text-white w-6 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      

    {/* services start */}
    <section>
      <div className='container'>
        <div className='xl:w-[470px] mx-auto'>
          <h2 className='font-sans heading text-center'>Our medical Services</h2>
          <p className='text__para text-center'>World-class care for everyone.Our health System offers unmatched,expert health care.</p>
        </div>

          <ServiceList />
        </div>
      </section>
      {/* services end */}

    {/* feature section */}
    <section>
      <div className='container shadow hover:shadow-lg'>
        <div className='flex items-center justify-between flex-col lg:flex-row'>
          {/* feature content */}
          <div className='xl:w-[670px]'>
            <h2 className='font-sans heading'>Book Appointments Instantly on Zoom</h2>
            <p className='text__para'>
              Schedule appointments with doctors and join consultations directly via Zoom links—no downloads or extra steps required.
            </p>
          </div>
          {/* feature img */}
          <div className="relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0 bg-gray-200">
            <img src={FEATUREIMG} alt="" className="w-3/4" />
          </div>
        </div>
      </div>
    </section>
    {/* feature section end */}

    {/* faqs */}
    {/* Removed FAQ section as per user request */}
    
    {/* testimonial */}
    {/* Removed testimonial section as per user request */}


  </div>
  )
}

export default Home;
