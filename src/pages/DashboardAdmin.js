import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardAdmin.css";
import logo from "../assets/Logo.png";

const DashboardAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({ docsCount: 0, patientsCount: 0, adminsCount: 0 });
  const navigate = useNavigate();

  // Check if the user is logged in by checking the token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Set state to true if a token is found
      fetchDashboardStats(); // Fetch the stats from API
    } else {
      navigate("/login"); // Redirect to login page if no token is found
    }
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
  
      // Fetch docs count
      const fetchDocsCount = async () => {
        const response = await fetch("http://localhost:8000/api/v1/user/doctor/count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.responseCode === "S100000") {
          return data.data.count || 0; // Assuming API returns a `count` field
        } else {
          console.error("Error fetching docs count:", data.responseMessage);
          return 0;
        }
      };
  
      // Fetch patients count
      const fetchPatientsCount = async () => {
        const response = await fetch("http://localhost:8000/api/v1/user/patient/count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.responseCode === "S100000") {
          return data.data.count || 0; // Assuming API returns a `count` field
        } else {
          console.error("Error fetching patients count:", data.responseMessage);
          return 0;
        }
      };
  
      // Fetch admins count
      const fetchAdminsCount = async () => {
        const response = await fetch("http://localhost:8000/api/v1/user/admin/count", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.responseCode === "S100000") {
          return data.data.count || 0; // Assuming API returns a `count` field
        } else {
          console.error("Error fetching admins count:", data.responseMessage);
          return 0;
        }
      };
      
      // Fetch all counts concurrently
      const [docsCount, patientsCount, adminsCount] = await Promise.all([
        fetchDocsCount(),
        fetchPatientsCount(),
        fetchAdminsCount(),
      ]);
  
      // Update state
      setStats({
        docsCount,
        patientsCount,
        adminsCount,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };
  

  if (!isLoggedIn) {
    return null; // Don't render the dashboard content if the user isn't logged in
  }

  return (
    <div className="dashboard-admin">
      <h1>Admin Dashboard</h1>
      <div className="card-container">
        {/* Doctors Count Card */}
        <div className="card" onClick={() => navigate("/doctors-list")}>
          <h2>Doctors</h2>
          <p>{stats.docsCount}</p>
        </div>

        {/* Patients Count Card */}
        <div className="card" onClick={() => navigate("/patients-list")}>
          <h2>Patients</h2>
          <p>{stats.patientsCount}</p>
        </div>

        {/* Admins Count Card */}
        <div className="card" onClick={() => navigate("/admins-list")}>
          <h2>Admins</h2>
          <p>{stats.adminsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
