import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Correct way to import jwt-decode
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Profile.css";
import logo from "../assets/Logo.png";

const Profile = () => {
  const [user, setUser] = useState(null); // State for user data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();

  // Function to get the token from localStorage and extract the user ID
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // Replace with your token storage method
    if (!token) {
      throw new Error("No token found");
    }
    const userId = localStorage.getItem("userId");
    return userId; // Assuming the token contains the user ID in the 'id' field
  };

  // Fetch profile information from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No token found");
          return;
        }
        const userId = getUserIdFromToken(); 
        const userType = localStorage.getItem("userType").toLowerCase();
        console.log(userType);// Extract user ID from token
        const response = await fetch(`http://localhost:8000/api/v1/user/${userType}/${userId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Add Bearer token
            },
          }); // Use the user ID in the path
        if (!response.ok) {
          throw new Error("Failed to fetch profile information");
        }
        const data = await response.json();
        console.log(data);
        setUser(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = () => {
    navigate("/update-profile"); // Navigate to the update profile page
  };


  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-container">Error: {error}</div>;
  }

  return (
    <div class="profile-container">
        <div class="profile-card">
            <div class="profile-photo-container">
            <img
                src={logo}
                alt="Profile Photo"
                class="profile-photo"
            />
            </div>
            <h2 class="profile-header">{user.firstname} {user.lastname}</h2>
            <div class="profile-details">
            <div class="profile-field">
                <span class="field-label">First Name:</span>
                <span class="field-value">{user.firstname}</span>
            </div>
            <div class="profile-field">
                <span class="field-label">Last Name:</span>
                <span class="field-value">{user.lastname}</span>
            </div>
            <div class="profile-field">
                <span class="field-label">Email:</span>
                <span class="field-value">{user.email}</span>
            </div>
            <div class="profile-field">
                <span class="field-label">Phone:</span>
                <span class="field-value">{user.mobile}</span>
            </div>
            </div>
            <button class="update-btn" onClick={handleUpdateProfile}>Update Profile</button>
        </div>
    </div>

  );
};

export default Profile;
