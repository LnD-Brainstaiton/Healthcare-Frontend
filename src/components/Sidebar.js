import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";
import logo from "../assets/Logo.png";

const Sidebar = ({ setIsSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle between expanded and collapsed

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
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/admins-list">Admins</Link>
          </li>
          <li>
            <Link to="/doctors-list">Doctors</Link>
          </li>
          <li>
            <Link to="/patients-list">Patients</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
