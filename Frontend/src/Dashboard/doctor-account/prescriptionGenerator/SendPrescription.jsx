import { useState } from "react";
import uploadImageToCloudinary from "../../../utils/uploadCloudinary.js";
import { toast } from "react-toastify";

const SendPrescription = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleFileInputChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    const data = await uploadImageToCloudinary(file);
    setPreviewURL(data.url);
    setSelectedFile(data.url);
  };

  const handleSendToWhatsApp = () => {
    if (!selectedFile) {
      toast.error("Please upload a prescription first");
      return;
    }

    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    // Format phone number (remove any spaces, dashes, etc.)
    const formattedNumber = phoneNumber.replace(/\D/g, '');
    
    // Ensure number starts with country code
    const whatsappNumber = formattedNumber.startsWith('91') ? formattedNumber : `91${formattedNumber}`;
    
    // Create WhatsApp URL with the prescription
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Here's your prescription: ${selectedFile}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-center font-semibold text-[18px] mb-8">Send Prescription via WhatsApp</h1>
      
      <div className="mb-6">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          Patient's Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter phone number (e.g., 9876543210)"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">Enter number with country code (e.g., 91 for India)</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Prescription
        </label>
        <div className="relative w-full h-[50px]">
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
            flex justify-center items-center cursor-pointer"
          >
            Upload PDF
          </label>
        </div>
      </div>

      {selectedFile && (
        <div className="mb-6">
          <p className="text-sm text-green-600">✓ Prescription uploaded successfully</p>
        </div>
      )}

      <button
        onClick={handleSendToWhatsApp}
        disabled={!selectedFile || !phoneNumber}
        className={`w-full py-2 px-4 rounded-md text-white font-medium
          ${!selectedFile || !phoneNumber 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-green-500 hover:bg-green-600'}`}
      >
        Send via WhatsApp
      </button>
    </div>
  );
};

export default SendPrescription;