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
                unmatched <br />
                ,expert health care. From the lab to the clinic.
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
                World-class care for everyone. Our health system offers
                unmatched <br />
                ,expert health care. From the lab to the clinic.
              </p>
            </div>

            <div>
              <div className="flex flex-row items-center justify-center">
                <img src={ICON2} alt="" className="h-[150px]" />
              </div>

              <Link
                to="/doctors"
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
                World-class care for everyone. Our health system offers
                unmatched <br />
                ,expert health care. From the lab to the clinic.
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
      {/* Mera code ends */}

      {/*about section start  */}
      <About />

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
            <h2 className='font-sans heading'>Get Virtual treatment <br />anytime.
            </h2>
            <ul className='pl-4'>
              <li className="text__para">
                1. Schedule the appoinment directly.
              </li>
              <li className='text__para'>
                2. Search for your physician here, and contact their office.
              </li>
              <li className='text__para'>
                3. View our physicians who are accepting new patients,use the online scheduling tool to select an appoinment time.
              </li>
            </ul>
            <Link to='/'>
              <button className='btn'>Learn More</button>
            </Link>
          </div>

            {/* feature img */}
            <div className="relative z-10 xl:w-[770px] flex justify-end mt-[50px] lg:mt-0 bg-gray-200">
              <img src={FEATUREIMG} alt="" className="w-3/4" />
              <div className="w-[150px] lg:w-[248px] bg-white absolute bottom-[50px] left-0 md:bottom-[100px] md:left-5 z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[6px] lg:gap-3">
                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[600]">
                      Tue,24
                    </p>
                    <p className="text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[600]">
                      10:00AM
                    </p>
                  </div>
                  <span className="w-5 h-5 lg:w-[34px] lg:h-[34px] flex items-center justify-center bg-yellowColor rounded py-1 px-[6px] lg:py-3 lg:px-[9px]">
                    <img src={videoIcon} />
                  </span>
                </div>

                <div className="w-[75px] lg:w-[96px] bg-[#CCF0F3] py-2 px-2 lg:py-[6px] lg:px-[10px] text-[8px] leading-[8px] lg:text-[12px] lg:leading-4 text-irisBlueColor font-[500] mt-2 lg:mt-4 rounded-full ">
                  Consultation
                </div>

                <div className="flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px] ">
                  <img src={avatarIcon} alt="" />
                  <h4 className="text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700] text-headingColor ">
                    Suresh
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* feature section end */}

      {/* faqs */}
      <section>
        <div className="container">
          <div className="flex justify-between gap-[50px] lg:gap-0 ">
            <div className="w-1/2 hidden md:block flex ">
              <img
                src={FAQIMG}
                className="h-[600px] w-[60%] ml-20 rounded-lg"
              />
            </div>

          <div className='w-full md:w-1/2'>
            <h2 className='font-sans heading'>
              Most questions by our beloved patients
            </h2>
            <FaqList />
          </div>
        </div>
      </div>
    </section>
    {/* faqs end */}

    {/* testimonial */}
    <section>
      <div className='container shadow-inner'>
        <div className='xl:w-[470px] mx-auto'>
          <h2 className='font-sans heading text-center'>What Our Patient Say</h2>
          <p className='text__para text-center'>World-class care for everyone.Our health System offers unmatched,expert health care.</p>
        </div>
        <Testimonial />
      </div>
    </section>
    {/* testimonail ends */}


  </div>
  )
}

export default Home;
