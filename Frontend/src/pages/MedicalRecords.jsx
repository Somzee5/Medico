import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux'; // REMOVE THIS LINE
import { toast } from 'react-toastify';
import HashLoader from 'react-spinners/HashLoader';
import uploadImageToCloudinary from '../utils/uploadCloudinary';
import { BASE_URL } from '../../config';

const MedicalRecordsPage = () => {
    // We will get the token directly from localStorage
    // Assuming your login process stores the token in localStorage under a key like 'token' or 'authToken'
    // Please adjust 'token' here if your actual localStorage key is different.
    const getAuthToken = () => localStorage.getItem('token'); // Or whatever key you use for your JWT token
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [documentTitle, setDocumentTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [medicalDocuments, setMedicalDocuments] = useState([]);

    // Function to fetch user's current documents from your backend
    const fetchMedicalDocuments = async () => {
        const token = getAuthToken();
        if (!token) {
            // No token, cannot fetch documents. This might mean the user is not logged in.
            // toast.info("Please log in to view your medical records."); // Optional: inform user
            setMedicalDocuments([]); // Clear any old documents
            return; 
        }

        try {
            setLoading(true);
            const res = await fetch(`${BASE_URL}/documents`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.message || 'Failed to fetch documents');
            }
            setMedicalDocuments(result.data || []);
        } catch (err) {
            console.error("Error fetching medical documents:", err);
            toast.error(err.message || "Failed to load documents.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch documents on component mount and when the component is re-rendered (e.g., after login/logout affecting token)
    useEffect(() => {
        fetchMedicalDocuments();
        // You might want to re-fetch if the token in localStorage changes,
        // but useEffect with no dependency array (or an empty one `[]`)
        // means it runs once. If token changes dynamically in your app,
        // you might need a custom hook or another way to trigger re-fetch.
        // For simplicity here, it fetches on initial load.
    }, []); // Empty dependency array means this runs once on mount.

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            setSelectedFile(file);
        } else {
            setSelectedFile(null);
            toast.error('Please select a PDF file.');
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select a file to upload.');
            return;
        }
        if (!documentTitle.trim()) {
            toast.error('Please enter a title for your document.');
            return;
        }
        
        const token = getAuthToken();
        if (!token) {
            toast.error('Authentication token not found. Please log in.');
            return;
        }

        setLoading(true);
        try {
            const cloudinaryResponse = await uploadImageToCloudinary(selectedFile);
            
            if (!cloudinaryResponse.url || !cloudinaryResponse.public_id) {
                throw new Error('Cloudinary upload failed or returned incomplete data.');
            }

            const backendRes = await fetch(`${BASE_URL}/documents/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: documentTitle,
                    url: cloudinaryResponse.url,
                    public_id: cloudinaryResponse.public_id,
                    originalFileName: selectedFile.name
                }),
            });

            const backendResult = await backendRes.json();

            if (!backendRes.ok) {
                throw new Error(backendResult.message || 'Failed to save document details to backend');
            }

            toast.success(backendResult.message);
            setSelectedFile(null);
            setDocumentTitle('');
            fetchMedicalDocuments(); // Refresh the list of documents
        } catch (err) {
            console.error("Error during document upload/save process:", err);
            toast.error(err.message || 'Error processing document.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDocument = async (publicId) => {
        if (!window.confirm('Are you sure you want to delete this document? This cannot be undone.')) {
            return;
        }
        
        const token = getAuthToken();
        if (!token) {
            toast.error('Authentication token not found. Please log in.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${BASE_URL}/documents/${publicId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message || 'Failed to delete document');
            }
            toast.success(result.message);
            fetchMedicalDocuments(); // Refresh the list
        } catch (err) {
            console.error("Error deleting document:", err);
            toast.error(err.message || "Failed to delete document.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container">
            <h2 className="heading text-center">Your Medical Documents Vault</h2>
            <p className="text_para text-center mb-10">Securely store and manage your personal medical records.</p>

            <div className="max-w-xl mx-auto p-5 border border-gray-200 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold text-headingColor mb-4">Upload New Document (PDF only)</h3>
                <input
                    type="text"
                    placeholder="Enter a title for your document (e.g., 'Blood Report 2023')"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primaryColor mb-3"
                    value={documentTitle}
                    onChange={(e) => setDocumentTitle(e.target.value)}
                />
                <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-textColor
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primaryColor file:text-white
                    hover:file:bg-irisBlueColor cursor-pointer"
                />
                {selectedFile && (
                    <p className="text-sm text-textColor mt-2">Selected: {selectedFile.name}</p>
                )}
                <button
                    onClick={handleFileUpload}
                    className="btn w-full mt-4"
                    disabled={!selectedFile || !documentTitle.trim() || loading}
                >
                    {loading ? <HashLoader size={25} color="#fff" /> : 'Upload Document'}
                </button>
            </div>

            <div className="mt-10">
                <h3 className="text-lg font-semibold text-headingColor mb-4">Your Uploaded Documents</h3>
                {loading && medicalDocuments.length === 0 ? (
                    <div className="flex justify-center items-center h-40">
                        <HashLoader size={30} color="#0067FF" />
                    </div>
                ) : medicalDocuments.length === 0 ? (
                    <p className="text-center text-textColor">No documents uploaded yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {medicalDocuments.map((doc, i) => (
                            <div key={doc.public_id || i} className="p-4 border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between">
                                <h4 className="font-semibold text-primaryColor mb-2">
                                    {doc.title || doc.originalFileName || `Document ${i + 1}`}
                                </h4>
                                <p className="text-sm text-textColor mb-1">
                                    File Name: {doc.originalFileName}
                                </p>
                                <p className="text-sm text-textColor">
                                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                                </p>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline mt-3 block"
                                >
                                    View Document (PDF)
                                </a>
                                {doc.public_id && (
                                    <button
                                        onClick={() => handleDeleteDocument(doc.public_id)}
                                        className="mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 text-sm"
                                        disabled={loading}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default MedicalRecordsPage;