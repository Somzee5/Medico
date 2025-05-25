import { useState } from "react";
import uploadImageToCloudinary from "../../../utils/uploadCloudinary.js";
import { toast } from "react-toastify";
import { BASE_URL } from "../../../config.js";

const SendPrescription = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(" ");
  const [loading, setLoading] = useState(false);

  const handleFileInputChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    // console.log(file);
    const data = await uploadImageToCloudinary(file);
    // console.log(data);
    setPreviewURL(data.url);
    setSelectedFile(data.url);

    try {
      const res = await fetch(
       ` ${BASE_URL}/doctors/profile/me/sendprescription`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            url: data.url 
        })
        }
      );

      const { message } = await res.json();
      // if(!res.ok){
      //   throw new Error(message)
      // }

      setLoading(false);
      toast.success(message);
    } catch (error) {
      toast.error(error.message);
      setLoading(false);
    }
    // setFormData({ ...formData, photo: data.url });
  };

  return (
    <>
      
        <h1 className="text-center font-semibold text-[18px] mt-20">Upload document to send on Whatsapp:</h1>
        <div className="relative w-[130px] h-[50px] flex mx-auto mb-20 mt-5">
          
          <input
            type="file"
            name="document"
            onChange={handleFileInputChange}
            id="customFile"
            accept=".pdf,.png,.jpg"
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
          <label
            htmlFor="customFile"
            className="w-full h-full text-white bg-blue-500 text-[18px] rounded-lg
            flex justify-center items-center  cursor-pointer"
          >
            Upload PDF
          </label>
        </div>
      
    </>
  );
};

export default SendPrescription;