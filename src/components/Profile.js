import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/doctor-2.png";
import { use } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userType = localStorage.getItem("userType")?.toLowerCase();

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const userId = localStorage.getItem("userId");
    return userId;
  };

  const userId = getUserIdFromToken();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }
        const userId = getUserIdFromToken();
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/${userType}/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch profile information");
        }
        const data = await response.json();
        setUser(data.data);
        console.log(data);
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
    navigate(`/update-profile/${userId}/${userType}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-100 pt-24 p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col w-full  bg-white shadow-md rounded-lg p-6 space-y-6">
        <div className="flex flex-col items-center">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Profile Photo"
              className="w-24 h-24 sm:w-48 sm:h-48 rounded-full object-cover border-4 border-teal-500"
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mt-4">
            {user.firstname} {user.lastname}
          </h2>
        </div>
        <div className=" w-full space-y-4">
          <ProfileField label="First Name" value={user.firstname} />
          <ProfileField label="Last Name" value={user.lastname} />
          <ProfileField label="Email" value={user.email} />
          <ProfileField label="Phone" value={user.mobile} />
          <ProfileField label="User Id" value={userId} />
          {userType === "patient" && (
            <>
              <ProfileField label="Gender" value={user.gender} />
              <ProfileField label="Age" value={user.age} />
              <ProfileField label="Address" value={user.address} />
              <ProfileField label="NID" value={user.nid} />
              <ProfileField label="Blood Group" value={user.bloodGroup} />
            </>
          )}
          {userType === "doctor" && (
            <>
              <ProfileField label="Registration No" value={user.bloodGroup} />
              <ProfileField label="Designation" value={user.designation} />
              <ProfileField label="Department" value={user.department} />
              <ProfileField label="Specialities" value={user.specialities} />
              <ProfileField label="Fee" value={user.fee} />
              <ProfileField label="Blood Group" value={user.bloodGroup} />
              <ProfileField label="Date of Birth" value={user.bloodGroup} />
            </>
          )}
        </div>
        <button
          onClick={handleUpdateProfile}
          className="w-full sm:w-3/12 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-300"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

// Helper component for consistent profile field rendering
const ProfileField = ({ label, value }) => (
  <div className="text-xl px-4">
    <div className="flex justify-start ">
      <span className="text-gray-600 w-2/6 ">{label}:</span>
      <span className="text-gray-800 ">{value || "N/A"}</span>
    </div>
    <hr className="my-4" />
  </div>
);

export default Profile;
