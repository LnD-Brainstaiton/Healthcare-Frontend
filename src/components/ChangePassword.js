import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import { Eye, EyeOff } from "lucide-react"; // Import icons

const ChangePassword = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Toggle current password visibility
  const [showNewPassword, setShowNewPassword] = useState(false); // Toggle new password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle confirm password visibility
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Regex for at least 1 lowercase, 1 uppercase, 1 number, 1 special character, and 8+ characters
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(formData.newPassword)) {
      setErrorMessage(
        "Password must contain at least one uppercase, one lowercase, one number, one special character, and be at least 8 characters long."
      );
      return;
    } else {
      setErrorMessage(null);
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New Password and Confirm Password do not match");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/change/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: formData.currentPassword,
            confirmPassword: formData.newPassword,
            newPassword: formData.newPassword,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to change password");

      setSuccessMessage("Password changed! Please login.");
      setTimeout(() => {
        navigate("/logout");
      }, 2000);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 pt-24 p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col w-full bg-white shadow-md rounded-lg p-6 space-y-6 mx-auto">
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-teal-500"
          />
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mt-4">
            Change Password
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="text-xl space-y-4">
          {/* Current Password Field */}
          <div className="mb-4 relative">
            <InputField
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* New Password Field */}
          <div className="mb-4 relative">
            <InputField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4 relative">
            <InputField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {errorMessage && (
            <div className="p-2 mb-4  rounded-lg font-bold bg-errorMessageBackground text-errorMessage">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="p-2 mb-4  rounded-lg font-bold bg-successMessageBackground text-successMessage">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-2/6 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, type = "text", ...props }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 font-medium mb-1">{label}</label>
    <input
      type={type}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xl"
      {...props}
    />
  </div>
);

export default ChangePassword;
