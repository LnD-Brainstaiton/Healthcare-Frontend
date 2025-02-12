import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCog,
  UserRound,
  ClipboardList,
  CalendarClock,
  CalendarRange,
} from "lucide-react";

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

  const cards = [
    {
      title: "Admins",
      count: stats.adminsCount,
      path: "/admins-list",
      icon: UserCog,
      color: "text-blue-600",
    },
    {
      title: "Doctors",
      count: stats.docsCount,
      path: "/doctors-list",
      icon: Users,
      color: "text-teal-600",
    },
    {
      title: "Patients",
      count: stats.patientsCount,
      path: "/patients-list",
      icon: UserRound,
      color: "text-purple-600",
    },
    {
      title: "Pending Doctors",
      count: stats.docsPendingCount,
      path: "/doctors-approve-list",
      icon: ClipboardList,
      color: "text-orange-600",
    },
    {
      title: "Pending Appointments",
      count: stats.appointmentsPendingCount,
      path: "/appointment-approve-list",
      icon: CalendarClock,
      color: "text-red-600",
    },
    // {
    //   title: "Appointment Reschedule",
    //   count: stats.adminsPendingCount,
    //   path: "/appointment-reapprove-list",
    //   icon: CalendarRange,
    //   color: "text-indigo-600",
    // },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
          Dashboard Overview
        </h1>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(card.path)}
                className="group bg-white hover:bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={`${card.color} p-3 rounded-full bg-opacity-10 bg-current group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className={`h-8 w-8 ${card.color}`} />
                  </div>

                  <h2 className="text-xl font-semibold text-gray-800">
                    {card.title}
                  </h2>

                  <p className={`text-3xl font-bold ${card.color}`}>
                    {card.count}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default DashboardAdmin;
