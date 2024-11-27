// Sidebar.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={isOpen ? "sidebar open" : "sidebar collapsed"}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <div className="hamburger-icon">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </button>
      <ul className={isOpen ? "sidebar-list" : "sidebar-list hidden"}>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/users">Users</Link>
        </li>
        <li>
          <Link to="/logout">Logout</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
