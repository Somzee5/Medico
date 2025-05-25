import { useState, useEffect } from "react";
import { BASE_URL } from "../../config";


const DeleteDoctors = () => {
  const [applications, setApplications] = useState([]);
  const getAllApp = async (e) => {
    // try {
    //   //   dispatch(setLoading(true));
    //   const temp = await fetchData(`/doctor/getnotdoctors`);
    //   setApplications(temp);
    //   //   dispatch(setLoading(false));
    // } catch (error) {}

    try {
      const res = await fetch(`${BASE_URL}/admin/getappdoctors`, {
        method: "get",
        headers: {
          "Content-Type": "application/json",
        },
        //   body: JSON.stringify(formatData)
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message);
      }

      setApplications(result);
      // dispatch({
      //   type:'LOGIN_SUCCESS',
      //   payload:{
      //     user:result.data,
      //     token:result.token,
      //     role:result.role
      //   }
      // })
      // const names = result.map(item => item.name);
      // console.log(names);
      // console.log(result)
      // setLoading(false)
      // toast.success(result.message)
      // navigate('/home')
    } catch (error) {
      console.log(error);
      // toast.error(error.message)
      // setLoading(false)
    }
  };

  const deleteDoctor = async (userId) => {
    try {
      // console.log(userId);
      const confirm = window.confirm("Are you sure you want to Delete?");
      if (confirm) {
        const response = await fetch(`${BASE_URL}/admin/deletedoctor`, {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ id: userId }),
        });

        if (!response.ok) {
          throw new Error("Unable to reject application");
        }

        // Assuming you have logic to handle successful rejection
        getAllApp();
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  useEffect(() => {
    getAllApp();
  }, []);

  return (
    <section className="user-section ">
      {applications.length > 0 ? (
        <div className="user-container ">
          {/* <h3 className="home-sub-heading font-bold text-center text-2xl mb-10">
            All Doctors
          </h3> */}
          <div className="flex justify-center items-center h-full">
            <table className="m-8 border border-gray-300 ">
              <thead className="text-bs text-headingColor uppercase bg-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-3 text-center border-r">
                    No
                  </th>
                  <th scope="col" className="px-6 py-3 text-center border-r">
                    Pic
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-bold text-center border-r"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-bold text-center border-r"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-bold text-center border-r"
                  >
                    Specialization
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-bold text-center border-r"
                  >
                    Reg. Yr
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-bold text-center border-r"
                  >
                    Reg. No
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-bold text-center border-r"
                  >
                    Qualifications
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-bold text-center border-r"
                  >
                    Experiences
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 font-bold text-center border-r"
                  >
                    Time Slots
                  </th>
                  <th scope="col" className="px-6 py-3 font-bold text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((doctor, index) => (
                  <tr
                    key={doctor._id}
                    className="bg-white hover:bg-gray-50 border-b border-gray-300"
                  >
                    <td className="px-6 py-4 text-center border-r">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      <a
                        href={doctor.photo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="w-10 h-10 rounded-full mx-auto"
                          src={
                            doctor.photo ||
                            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                          }
                          alt={doctor.name}
                        />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center border-r text-primaryColor font-sans font-bold uppercase">
                      {doctor.name}
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      {doctor.email}
                    </td>
                    <td className="px-6 py-4 text-center border-r text-primaryColor uppercase font-sans font-bold">
                      {doctor.specialization}
                    </td>
                    <td className="px-6 py-4 text-center border-r text-primaryColor uppercase font-sans font-bold">
                      {doctor.yearofRegistartion}
                    </td>
                    <td className="px-6 py-4 text-center border-r text-primaryColor uppercase font-sans font-bold">
                      {doctor.registrationNumber}
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      <ul>
                        {doctor.qualifications.map((qualification, idx) => (
                          <li key={idx} className="mb-1">
                            <span className="font-semibold">
                              {qualification.degree}
                            </span>{" "}
                            - {qualification.university}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      <ul>
                        {doctor.experiences.map((experience, idx) => (
                          <li key={idx} className="mb-1">
                            <span className="font-semibold">
                              {experience.hospital}
                            </span>{" "}
                            - {experience.position}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      <ul>
                        {doctor.timeSlots.map((timeslot, idx) => (
                          <li key={idx} className="mb-1">
                            {timeslot.day} - {timeslot.startingTime} -{" "}
                            {timeslot.endingTime}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        <div className="mr-2">
                          {/* <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={() => acceptDoctor(doctor._id)}
                      >
                        Accept
                      </button> */}
                        </div>
                        <div>
                          <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            onClick={() => deleteDoctor(doctor._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        </div>
      ) : (
        <div className="text-center text-primaryColor">No Doctors</div>
      )}
    </section>
  );
};

export default DeleteDoctors;
