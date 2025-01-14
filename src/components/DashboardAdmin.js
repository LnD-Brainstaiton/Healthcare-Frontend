import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardAdmin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [stats, setStats] = useState({
    docsCount: 0,
    patientsCount: 0,
    adminsCount: 0,
    docsPendingCount: 0,
    appointmentsPendingCount: 0,
    adminsPendingCount: 0,
  });
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

      const [
        docsCount,
        patientsCount,
        adminsCount,
        docsPendingCount,
        appointmentsPendingCount,
        adminsPendingCount,
      ] = await Promise.all([
        fetchCounts(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/count`
        ),
        fetchCounts(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/patient/count`
        ),
        fetchCounts(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/admin/count`
        ),
        fetchCounts(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/pending-doctor-count`
        ),
        fetchCounts(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/pending-appointment-count`
        ),
        fetchCounts(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/pending-admin-count`
        ),
      ]);

      setStats({
        docsCount,
        patientsCount,
        adminsCount,
        docsPendingCount,
        appointmentsPendingCount,
        adminsPendingCount,
      });
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
          onClick={() => navigate("/admins-list")}
        >
          <h2 className="text-primaryText mb-4 text-2xl font-bold text-center">
            Admins
          </h2>
          <p className=" text-4xl font-bold">{stats.adminsCount}</p>
        </div>
        <div
          className="flex bg-cardBackground shadow-custom-dark flex-col justify-center items-center  w-full h-60 rounded-xl transition-transform hover:bg-cardBackgroundHover hover:-translate-y-2"
          onClick={() => navigate("/doctors-list")}
        >
          <h2 className="text-primaryText mb-4 text-2xl font-bold  text-center">
            Doctors
          </h2>
          <p className=" text-4xl font-bold">{stats.docsCount}</p>
        </div>
        <div
          className="flex bg-cardBackground shadow-custom-dark flex-col justify-center items-center  w-full h-60 rounded-xl transition-transform hover:bg-cardBackgroundHover hover:-translate-y-2"
          onClick={() => navigate("/patients-list")}
        >
          <h2 className="text-primaryText mb-4 text-2xl font-bold  text-center">
            Patients
          </h2>
          <p className=" text-4xl font-bold">{stats.patientsCount}</p>
        </div>
        <div
          className="flex bg-cardBackground shadow-custom-dark flex-col justify-center items-center  w-full h-60 rounded-xl transition-transform hover:bg-cardBackgroundHover hover:-translate-y-2"
          onClick={() => navigate("/doctors-approve-list")}
        >
          <h2 className="text-primaryText mb-4 text-2xl font-bold text-center">
            Pending Doctors
          </h2>
          <p className=" text-4xl font-bold">{stats.docsPendingCount}</p>
        </div>
        <div
          className="flex bg-cardBackground shadow-custom-dark flex-col justify-center items-center  w-full h-60 rounded-xl transition-transform hover:bg-cardBackgroundHover hover:-translate-y-2"
          onClick={() => navigate("/appointment-approve-list")}
        >
          <h2 className="text-primaryText mb-4 text-2xl font-bold  text-center">
            Pending Appointment
          </h2>
          <p className=" text-4xl font-bold">
            {stats.appointmentsPendingCount}
          </p>
        </div>
        <div
          className="flex bg-cardBackground shadow-custom-dark flex-col justify-center items-center  w-full h-60 rounded-xl transition-transform hover:bg-cardBackgroundHover hover:-translate-y-2"
          onClick={() => navigate("/appointment-reapprove-list")}
        >
          <h2 className="text-primaryText mb-4 text-2xl font-bold text-center">
            Appointment Reschedule
          </h2>
          <p className=" text-4xl font-bold">{stats.adminsPendingCount}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
