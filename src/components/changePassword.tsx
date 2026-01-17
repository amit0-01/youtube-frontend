import { useState } from "react";
import { changePassword } from "../Service/UserProfile";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [token] = useState(() => {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      return userInfo?.accessToken || null;
    }
    return null;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
  
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      toast.error("New passwords do not match.");
      return;
    }
  
    try {
      setLoading(true);
      const payload = {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      };
  

      const response = await changePassword(payload, token);

  
      if (response.success) {
        toast.success(response.message);
        setSuccess(response.message);
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        navigate("/home");
      }
    } catch (error: any) {

  
      // Handle specific error for invalid old password
      if (error.response?.data?.message === "Invalid old password") {
        toast.error("Incorrect old password. Please try again.");
      } else {
        toast.error(error.response?.data?.message || "Invalid old password");
      }
  
      setError(error.response?.data?.message || "Invalid old password");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Change Password</h2>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
