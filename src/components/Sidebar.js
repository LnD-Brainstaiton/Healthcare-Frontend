import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import logo from "../assets/Logo.png";

const Sidebar = ({ setIsSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle between expanded and collapsed
  const [userType, setUserType] = useState(""); // To store the userType
  
  useEffect(() => {
    // Retrieve userType from localStorage (or wherever you store the userType)
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType.toLowerCase());
    }
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/close state
    setIsSidebarOpen(!isOpen); // Set the parent state
  };

  return (
    <div className="sidebar-container">
      <div className={isOpen ? "sidebar open" : "sidebar collapsed"}>
        <div className="logo-ham-container">
          <img src={logo} className="sidebar-logo" alt="logo" />
          <button className="toggle-btn" onClick={toggleSidebar}>
            <div className="hamburger-icon">
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
            </div>
          </button>
        </div>
        <ul className={isOpen ? "sidebar-list" : "sidebar-list hidden"}>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          {/* Common Link for All Users */}
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          
          {/* Conditionally Render Links Based on User Type */}
          {userType === "admin" && (
            <>
              <li>
                <Link to="/admins-list">Admins</Link>
              </li>
              <li>
                <Link to="/doctors-list">Doctors</Link>
              </li>
              <li>
                <Link to="/patients-list">Patients</Link>
              </li>
              <li>
                <Link to="/appointments-list">Appointment History</Link>
              </li>
              <li>
                <Link to="/doctors-approve-list">Pending Doctors</Link>
              </li>
              <li>
                <Link to="/appointment-approve-list">Pending Appointment</Link>
              </li>
              <li>
                <Link to="/appointment-reapprove-list">Pending Appointment Reschedule</Link>
              </li>
            </>
          )}
          
          {userType === "doctor" && (
            <>
              <li>
                <Link to="/appointments-list">Appointment History</Link>
              </li>
              <li>
                <Link to="/appointment-reschedule">Appointment Reschedule Request</Link>
              </li>
            </>
          )}
          
          {userType === "patient" && (
            <>
              <li>
                <Link to="/doctor-list">Doctors</Link>
              </li>
              <li>
                <Link to="/patient-prescriptions">My Prescription</Link>
              </li>

              <li>
                <Link to="/appointments-list">Appointment History</Link>
              </li>
            </>
          )}

        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
