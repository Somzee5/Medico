// import React from 'react';

// const Contact = () => {
//   return (
//     <section>
//       <div className='px-4 mx-auto max-w-screen-md'>
//         <h2 className='heading text-center'>
//           Contact Us
//         </h2>
//         <p className='mb-8 lg:mb-16 font-light text-center text__para '>
//           Got a technical issue? Want to send feedback about a beta feature? Let us know.
//         </p>
//         <form action='#' className='space-y-8'>
//           <div>
//             <label htmlFor='email' className='form__label'>
//               Your Email
//             </label>
//             <input type='email' id='email' className='form__input mt-1' placeholder='example@gmail.com' />
//           </div>

//           <div className='sm:col-span-2'>
//             <label htmlFor='subject' className='form__label'>
//               Subject
//             </label>
//             <input type='text' id='subject' className='form__input mt-1' placeholder='Let us know how we can help you' />
//           </div>

//           <div className='sm:col-span-2'>
//             <label htmlFor='message' className='form__label'>
//               Your Message
//             </label>
//             <textarea rows="6" type='text' id='message' className='form__input mt-1' placeholder='Leave a comment...' />
//           </div>
//           <button type='submit' className='btn rounded sm:w-fit'>
//            Submit
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default Contact;

import { useContext , useState} from "react";
import emailjs from "emailjs-com";
import { authContext } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

const Contact = () => {
  const { user, role } = useContext(authContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    emailjs
      .sendForm(
        "service_rom38fg",
        "template_baz2yek",
        event.target,
        "rDuH2Yo9yfNZcCwSF"
      )
      .then((result) => {
        setLoading(false);
        toast.success("Mail Sended Successfully");
      })
      .catch((error) => {
        toast.error(error);
        setLoading(false);
      });

    event.target.reset();
  };

  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md shadow-lg p-4">
        <h2 className="heading text-center">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text__para ">
          Got a technical issue? Want to send feedback about a beta feature? Let
          us know.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="form__label">
              Your Email
            </label>
            <input
              type="email"
              name="email_id"
              id="email"
              className="form__input mt-1 cursor-not-allowed"
              placeholder="example@gmail.com"
              value={user.email}
              aria-readonly
              readOnly
            />
          </div>
          <div>
            <label htmlFor="name" className="form__label">
              Your Name
            </label>
            <input
              type="name"
              name="name"
              id="name"
              className="form__input mt-1 cursor-not-allowed"
              placeholder="ABC"
              value={user.name}
              aria-readonly
              readOnly
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="role" className="form__label">
              Role
            </label>
            <input
              type="text"
              name="role"
              id="role"
              className="form__input mt-1 cursor-not-allowed"
              placeholder="Doc or Pat"
              value={role}
              aria-readonly
              readOnly
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="subject" className="form__label">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              id="subject"
              className="form__input mt-1"
              placeholder="Let us know how we can help you"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="message" className="form__label">
              Your Message
            </label>
            <textarea
              name="message"
              rows="6"
              id="message"
              className="form__input mt-1"
              placeholder="Leave a comment..."
              required
            />
          </div>
          <button type="submit" className="bg-primaryColor text-white text-[18px] leading-[30px] w-full py-3 px-4 rounded-lg">
          {loading ? (<HashLoader size={25} color='#ffffff' />) : ("Submit")}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
