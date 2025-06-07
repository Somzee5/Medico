import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${BASE_URL}/ambulances/profile/me`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete account");
      }

      toast.success("Account deleted successfully");
      dispatch({ type: "LOGOUT" });
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account");
    }
  };

  return (
    <div className="max-w-[1170px] px-5 mx-auto">
      <div className="grid md:grid-cols-3 gap-10">
        {/* ... existing code ... */}
        
        <div className="md:col-span-2 md:px-[30px]">
          <div className="mt-[30px] md:mt-0">
            <button 
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 mt-4 p-3 text-[16px] leading-7 rounded-md text-white hover:bg-white hover:text-red-600 border-2 border-red-600"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 