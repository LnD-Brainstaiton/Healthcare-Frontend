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
        isOpen ? "w-80 px-8" : "w-0"
      } top-16 lg:top-0 z-10 fixed h-full lg:relative lg:h-auto transition-all duration-300 overflow-hidden`}
    >
      {isOpen && (
        <ul className="block py-2 text-xl ">
          <div className="hover:bg-tealBlueHover hover:rounded-md">
            <li className=" p-2 ">
              <Link to="/">Dashboard</Link>
            </li>
          </div>
          <div className="hover:bg-tealBlueHover hover:rounded-md">
            <li className="  p-2">
              <Link to="/profile">Profile</Link>
            </li>
          </div>
          <div className="hover:bg-tealBlueHover hover:rounded-md">
            <li className="  p-2">
              <Link to="/change-password">Change Password</Link>
            </li>
          </div>
          {userType === "admin" && (
            <>
              <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="p-2">
                  <Link to="/admins-list">Admins</Link>
                </li>
              </div>
              <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="p-2">
                  <Link to="/doctors-list">Doctors</Link>
                </li>
              </div>
              <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="p-2">
                  <Link to="/patients-list">Patients</Link>
                </li>
              </div>
              <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="p-2">
                  <Link to="/appointments-list">Appointment History</Link>
                </li>
              </div>
              <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="p-2">
                  <Link to="/doctors-approve-list">Pending Doctors</Link>
                </li>
              </div>
              <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="p-2">
                  <Link to="/appointment-approve-list">
                    Pending Appointment
                  </Link>
                </li>
              </div>
              {/* <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="p-2">
                  <Link to="/appointment-reapprove-list">
                    Pending Appointment Reschedule
                  </Link>
                </li>
              </div> */}
            </>
          )}
          {userType === "doctor" && (
            <>
              <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="  p-2">
                  <Link to="/appointments-list">Appointment History</Link>
                </li>
              </div>
              {/* <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="  p-2">
                  <Link to="/appointment-reschedule">
                    Appointment Reschedule Request
                  </Link>
                </li>
              </div> */}
            </>
          )}

          {userType === "patient" && (
            <>
              <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="  p-2">
                  <Link to="/doctor-list">Doctors</Link>
                </li>
              </div>
              {/* <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="  p-2">
                  <Link to="/patient-prescriptions">My Prescription</Link>
                </li>
              </div> */}
              <div className="hover:bg-tealBlueHover hover:rounded-md">
                <li className="  p-2">
                  <Link to="/appointments-list">Appointment History</Link>
                </li>
              </div>
            </>
          )}
        </ul>
      )}
    </aside>
  );
};

export default Sidebar;
