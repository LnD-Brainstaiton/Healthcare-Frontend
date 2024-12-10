import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import { jwtDecode } from "jwt-decode"; // Correct way to import jwt-decode
import logo from "../assets/Logo.png";

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    adminId: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true); // State to handle loading

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const userType = localStorage.getItem("userType").toLowerCase();
        const userId = localStorage.getItem("userId"); // Assuming user ID is in the 'sub' field of the token

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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      console.log(formData);

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
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-photo-container">
          <img src={logo} alt="Profile Photo" className="profile-photo" />
        </div>
        <h2 className="profile-header">Update Profile</h2>
        <form className="profile-details" onSubmit={handleSubmit}>
          <div className="profile-field">
            <label className="field-label">First Name:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="profile-field">
            <label className="field-label">Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter last name"
              required
            />
          </div>
          <div className="profile-field">
            <label className="field-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="profile-field">
            <label className="field-label">Phone:</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter phone number"
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="update-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
