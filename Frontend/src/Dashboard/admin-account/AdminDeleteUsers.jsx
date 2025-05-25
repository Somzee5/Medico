import {useState , useEffect} from "react";
import { BASE_URL } from "../../config";

const AdminDeleteUsers = () => {
  const [applications, setApplications] = useState([]);
  const getAllApp = async (e) => {
    // try {
    //   //   dispatch(setLoading(true));
    //   const temp = await fetchData(`/doctor/getnotdoctors`);
    //   setApplications(temp);
    //   //   dispatch(setLoading(false));
    // } catch (error) {}

    try {
      const res = await fetch(`${BASE_URL}/admin/getusers`, {
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

  const deleteUser = async (userId) => {
    try {
      const confirm = window.confirm("Are you sure you want to Delete?");
      if (confirm) {
        const response = await fetch(`${BASE_URL}/admin/deleteuser`, {
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
                    S.No
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
                    Gender
                  </th>
                  <th scope="col" className="px-6 py-3 font-bold text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((user, index) => (
                  <tr
                    key={user._id}
                    className="bg-white hover:bg-gray-50 border-b border-gray-300"
                  >
                    <td className="px-6 py-4 text-center border-r">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      <a
                        href={user.photo}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="w-10 h-10 rounded-full mx-auto"
                          src={
                            user.photo ||
                            "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
                          }
                          alt={user.name}
                        />
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-center border-r">
                      {user.gender}
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
                            onClick={() => deleteUser(user._id)}
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
        <div className="text-center text-primaryColor">No Users</div>
      )}
    </section>

  );
};

export default AdminDeleteUsers;
