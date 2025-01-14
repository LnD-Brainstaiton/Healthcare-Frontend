import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen }) => {
  const [userType, setUserType] = useState(""); // To store the userType

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType.toLowerCase());
    }
  }, []);

  return (
    <aside
      className={`bg-tealBlue text-white ${
        isOpen ? "w-4/12 px-6" : "w-0"
      } transition-all duration-300 overflow-hidden`}
    >
      {isOpen && (
        <ul className="block py-2 text-xl ">
          <li className="hover:text-borderGray p-2">
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li className="hover:text-borderGray p-2">
            <Link to="/profile">Profile</Link>
          </li>
          {userType === "admin" && (
            <>
              <li className="hover:text-borderGray p-2">
                <Link to="/admins-list">Admins</Link>
              </li>
              <li className="hover:text-borderGray p-2">
                <Link to="/doctors-list">Doctors</Link>
              </li>
              <li className="hover:text-borderGray p-2">
                <Link to="/patients-list">Patients</Link>
              </li>
              <li className="hover:text-borderGray p-2">
                <Link to="/appointments-list">Appointment History</Link>
              </li>
              <li className="hover:text-borderGray p-2">
                <Link to="/doctors-approve-list">Pending Doctors</Link>
              </li>
              <li className="hover:text-borderGray p-2">
                <Link to="/appointment-approve-list">Pending Appointment</Link>
              </li>
              <li className="hover:text-borderGray p-2">
                <Link to="/appointment-reapprove-list">
                  Pending Appointment Reschedule
                </Link>
              </li>
            </>
          )}
          {userType === "doctor" && (
            <>
              <li className="hover:text-borderGray p-2">
                <Link to="/appointments-list">Appointment History</Link>
              </li>
              <li className="hover:text-borderGray p-2">
                <Link to="/appointment-reschedule">
                  Appointment Reschedule Request
                </Link>
              </li>
            </>
          )}

          {userType === "patient" && (
            <>
              <li className="hover:text-borderGray p-2">
                <Link to="/doctor-list">Doctors</Link>
              </li>
              <li className="hover:text-borderGray p-2">
                <Link to="/patient-prescriptions">My Prescription</Link>
              </li>

              <li className="hover:text-borderGray p-2">
                <Link to="/appointments-list">Appointment History</Link>
              </li>
            </>
          )}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
