import React, { useRef, useState } from 'react';
import starIcon from "../../assets/images/Star.png";
import DoctorAbout from './DoctorAbout.jsx';
import Feedback from './Feedback.jsx';
import SidePanel from './SidePanel.jsx'; // Assuming this is your SidePanel for doctors
import { BASE_URL } from '../../config';
import useFetchData from '../../hooks/useFetchData';
import Loader from '../../components/Loader/Loading';
import Error from '../../components/Error/Error.jsx';
import { useParams } from 'react-router-dom';

const DoctorDetails = () => {
  const [tab, setTab] = useState("about");
  const { id } = useParams();
  const sidePanelRef = useRef(null);

  const { data: doctor, loading, error } = useFetchData(`${BASE_URL}/doctors/${id}`);

  const {
    name,
    qualifications,
    experiences,
    timeSlots,
    reviews,
    bio,
    about,
    averageRating,
    totalRating,
    specialization,
    ticketPrice,
    photo,
  } = doctor;

  const handleScrollToSidePanel = () => {
    if (sidePanelRef.current) {
      sidePanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section>
      <div className='max-w-[1170px] px-5 mx-auto'>

        {loading && <Loader />}
        {error && <Error />}

        {!loading && !error && (
          <div className='grid md:grid-cols-3 gap-[50px]'>

            {/* Left column */}
            <div className='md:col-span-2'>

              {/* Doctor basic info */}
              <div className='flex items-center gap-5'>
                <figure className='max-w-[200px] max-h-[200px]'>
                  <img src={photo} className='w-full rounded-md' alt={name} />
                </figure>
                <div>
                  <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-6 lg:py-2 lg:px-6 text-[12px] leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded '>
                    {specialization}
                  </span>
                  <h3 className='text-headinColor text-[22px] leading-9 mt-3 font-bold '>
                    {name}
                  </h3>
                  <div className='flex items-center gap-[6px]'>
                    <span className='flex items-center gap-[6px] text-[14px] leading-5 lg:text-[16px] lg:leading-7 font-semibold text-headingColor'>
                      <img src={starIcon} alt='Star Icon' /> {averageRating}
                    </span>
                    <span>({totalRating})</span>
                  </div>
                  <p className='text__para text-[14px] leading-5 md:text-[15px]'>
                    {bio}
                  </p>

                  {/* Book Now Button */}
                  <button
                    onClick={handleScrollToSidePanel}
                    className="btn mt-4 px-6 py-2 rounded-md text-white bg-primaryColor hover:bg-primaryColorDark transition"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className='mt-[50px] border-b border-solid border-[#0066ff34]'>
                <button
                  onClick={() => setTab('about')}
                  className={`${tab === 'about' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                >
                  About
                </button>
                <button
                  onClick={() => setTab('feedback')}
                  className={`${tab === 'feedback' && 'border-b border-solid border-primaryColor'} py-2 px-5 mr-5 text-[16px] leading-7 text-headingColor font-semibold`}
                >
                  Feedback
                </button>
              </div>

              {/* Tab content */}
              <div className='mt-[50px]'>
                {tab === 'about' && (
                  <DoctorAbout
                    name={name}
                    about={about}
                    qualifications={qualifications}
                    experiences={experiences}
                  />
                )}
                {tab === 'feedback' && (
                  <Feedback
                    reviews={reviews}
                    totalRating={totalRating}
                  />
                )}
              </div>
            </div>

            {/* Right column (SidePanel for booking) */}
            <div>
              <div ref={sidePanelRef}>
                <SidePanel
                  doctorId={doctor._id}
                  ticketPrice={ticketPrice}
                  timeSlots={timeSlots}
                />
              </div>
            </div>

          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorDetails;