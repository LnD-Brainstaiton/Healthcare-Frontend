import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/DashboardAdmin.module.css";
import logo from "../assets/Logo.png";

const DashboardDoctor = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({ docsCount: 0, patientsCount: 0, adminsCount: 0, docsPendingCount: 0, appointmentsPendingCount: 0, adminsPendingCount: 0 });
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
        if (data.responseCode === "S100000") {
          return data.data.count || 0;
        } else {
          console.error("Error fetching count:", data.responseMessage);
          return 0;
        }
      };

      const [docsCount, patientsCount, adminsCount, docsPendingCount, appointmentsPendingCount, adminsPendingCount] = await Promise.all([
        fetchCounts("http://localhost:8000/api/v1/user/doctor/count"),
        fetchCounts("http://localhost:8000/api/v1/user/patient/count"),
        fetchCounts("http://localhost:8000/api/v1/user/admin/count"),
        fetchCounts("http://localhost:8000/api/v1/user/pending-doctor-count"),
        fetchCounts("http://localhost:8000/api/v1/user/pending-appointment-count"),
        fetchCounts("http://localhost:8000/api/v1/user/pending-admin-count"),
      ]);

      setStats({ docsCount, patientsCount, adminsCount, docsPendingCount, appointmentsPendingCount, adminsPendingCount });
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
        <div className={styles.card} onClick={() => navigate("/admins-list")}>
          <h2 className={styles.cardHeading}>Upcoming Appointments</h2>
          <p className={styles.cardText}>{stats.adminsCount}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardDoctor;
