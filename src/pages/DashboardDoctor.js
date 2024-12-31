import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/DashboardAdmin.module.css";
import logo from "../assets/Logo.png";

const DashboardDoctor = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({ upcomingAppointmentCount: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchDashboardStats();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const fetchCounts = async (url) => {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data);
        if (data.responseCode === "S100000") {
          return data.data.count || 0;
        } else {
          console.error("Error fetching count:", data.responseMessage);
          return 0;
        }
      };

      const getUserIdFromToken = () => {
        const token = localStorage.getItem("token"); // Replace with your token storage method
        if (!token) {
          throw new Error("No token found");
        }
        return localStorage.getItem("userId"); // Assuming the userId is stored separately
      };

      const now = new Date();
      const currentDate = now.toISOString().split("T")[0]; // Get the date in "YYYY-MM-DD" format
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`; // Get the time in "HH:mm" format
      const userId = getUserIdFromToken();

      let queryParams = {
        doctorId: userId,
        date: currentDate, // Assuming the API accepts a "date" parameter
        time: currentTime, // Assuming the API accepts a "time" parameter
      };
  
      const queryString = new URLSearchParams(queryParams).toString();


      const [upcomingAppointmentCount] = await Promise.all([
        fetchCounts(`http://localhost:8000/api/v1/appointment/doctor/upcoming/appointment/count?${queryString}`),
      ]);

      setStats({ upcomingAppointmentCount});
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className={styles.dashboardAdmin}>
      <h1 className={styles.heading}>Doctor Dashboard</h1>
      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={() => navigate("/upcoming-appointments-list")}>
          <h2 className={styles.cardHeading}>Upcoming Appointments</h2>
          <p className={styles.cardText}>{stats.upcomingAppointmentCount}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardDoctor;
