import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/Profile.css";
import logo from "../assets/Logo.png";

const Profile = () => {
  const [user, setUser] = useState(null); // State for user data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(null); // State for error handling
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType")?.toLowerCase(); // Get userType from localStorage

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
        console.log(userType + " " + userId); // Extract user ID from token
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
    const userId = getUserIdFromToken(); 
    // const userType = getUserIdFromToken(); 
    navigate(`/update-profile/${userId}/${userType}`); // Navigate to the update profile page
  };

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-container">Error: {error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-photo-container">
          <img
            src={logo}
            alt="Profile Photo"
            className="profile-photo"
          />
        </div>
        <h2 className="profile-header">{user.firstname} {user.lastname}</h2>
        <div className="profile-details">
          <div className="profile-field">
            <span className="field-label">First Name:</span>
            <span className="field-value">{user.firstname}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Last Name:</span>
            <span className="field-value">{user.lastname}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Email:</span>
            <span className="field-value">{user.email}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Phone:</span>
            <span className="field-value">{user.mobile}</span>
          </div>

          {/* Conditionally render fields based on userType */}
          {userType === "patient" && (
            <>
              <div className="profile-field">
                <span className="field-label">Gender:</span>
                <span className="field-value">{user.gender}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Age:</span>
                <span className="field-value">{user.age}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Address:</span>
                <span className="field-value">{user.address}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">NID:</span>
                <span className="field-value">{user.nid}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Blood Group:</span>
                <span className="field-value">{user.bloodGroup}</span>
              </div>
            </>
          )}

          {/* Fields for doctor or admin can be conditionally rendered similarly */}
          {userType === "doctor" && (
            <>
              <div className="profile-field">
                <span className="field-label">Designation:</span>
                <span className="field-value">{user.designation}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Department:</span>
                <span className="field-value">{user.department}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Specialities:</span>
                <span className="field-value">{user.specialities}</span>
              </div>
              <div className="profile-field">
                <span className="field-label">Fee:</span>
                <span className="field-value">{user.fee}</span>
              </div>
            </>
          )}
        </div>
        <button className="update-btn" onClick={handleUpdateProfile}>Update Profile</button>
      </div>
    </div>
  );
};

export default Profile;
