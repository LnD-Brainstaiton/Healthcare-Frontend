import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}`; // Get the time in "HH:mm" format
      const userId = getUserIdFromToken();

      let queryParams = {
        doctorId: userId,
        date: currentDate, // Assuming the API accepts a "date" parameter
        time: currentTime, // Assuming the API accepts a "time" parameter
      };

      const queryString = new URLSearchParams(queryParams).toString();

      const [upcomingAppointmentCount] = await Promise.all([
        fetchCounts(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/appointment/doctor/upcoming/appointment/count?${queryString}`
        ),
      ]);

      setStats({ upcomingAppointmentCount });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="grid">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 p-20">
        <div
          className="flex bg-cardBackground shadow-custom-dark flex-col justify-center items-center w-full h-60 rounded-xl transition-transform hover:bg-cardBackgroundHover hover:-translate-y-2"
          onClick={() => navigate("/upcoming-appointments-list")}
        >
          <h2 className="text-primaryText mb-4 text-2xl font-bold text-center">
            Upcoming Appointments
          </h2>
          <p className=" text-4xl font-bold">
            {stats.upcomingAppointmentCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardDoctor;
