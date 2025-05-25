import React from "react";
import aboutImg from "../../assets/images/about.png";
import aboutCardImg from "../../assets/images/about-card.png";
import ABOUTIMG from "../../assets/images/ABOUTIMG.avif";
import { Link } from "react-router-dom";
//hello world
const About = () => {
    return (<section>
        <div className='container shadow hover:shadow-lg p-2'>
            <div className='flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row'>
                {/* about img */}
                <div className='relative w-3/4 lg:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1'>
                    <img src={ABOUTIMG} alt='' className='lg:w-[70%] lg:h-[500px] rounded-lg md:w-[100%] md:h-[400px]'/>
                    
                </div>
                {/* about content  */}
                <div className='w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2'>
                  <h2 className='font-sans heading'>Among the nation's leading</h2>
                  <p className='text__para'>Our platform connects you with a network of highly qualified and experienced doctors from across the country. With diverse specialties and areas of expertise, you're sure to find the right doctor for your needs.</p>

                   <p className='text__para mt-[30px]'>Experience the difference with our carefully curated selection of doctors. Renowned for their expertise and dedication to patient care, they'll provide you with personalized attention and guidance on your unique health journey.</p>

                   <Link to="/"><button className='btn'>Learn More</button></Link>
                </div>
            </div>
        </div>
    </section>
  );
};

export default About;
