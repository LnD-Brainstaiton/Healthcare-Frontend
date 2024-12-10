import React, { useState, useEffect } from "react";
import "../styles/ProfileUpdate.css";
import logo from "../assets/Logo.png";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    adminId: "",
    // currentPassword: "", // Added currentPassword field
    password: "", // Added password field
    confirmPassword: "", // Added confirmPassword field
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const userType = localStorage.getItem("userType").toLowerCase();
        const userId = localStorage.getItem("userId");

        const response = await fetch(`http://localhost:8000/api/v1/user/${userType}/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setFormData({
          firstname: data.data.firstname,
          lastname: data.data.lastname,
          email: data.data.email,
          mobile: data.data.mobile,
          adminId: data.data.adminId,
        //   currentPassword: "",
          password: "",
          confirmPassword: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch("http://localhost:8000/api/v1/user/admin/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  return (
    <div className="update-profile-container">
      <div className="update-profile-card">
        <div className="update-profile-photo-container">
          <img src={logo} alt="Profile Photo" className="update-profile-photo" />
        </div>
        <h2 className="update-profile-header">Update Profile</h2>
        <form className="update-profile-details" onSubmit={handleSubmit}>
          <div className="update-profile-field">
            <label className="update-field-label">First Name:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="update-profile-field">
            <label className="fupdate-ield-label">Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter last name"
              required
            />
          </div>
          <div className="update-profile-field">
            <label className="update-field-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="update-profile-field">
            <label className="update-field-label">Phone:</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter phone number"
              required
            />
          </div>
          
          {/* Current Password Field
          <div className="update-profile-field">
            <label className="update-field-label">Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter current password"
              required
            />
          </div> */}

          {/* New Password Field */}
          <div className="update-profile-field">
            <label className="update-field-label">New Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter new password"
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="update-profile-field">
            <label className="update-field-label">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Confirm new password"
              required
            />
          </div>
          <div>
            {error && <p className="update-error-message">{error}</p>}
            {success && <p className="update-success-message">{success}</p>}
            <button type="submit" className="update-update-btn">Save Changes</button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
