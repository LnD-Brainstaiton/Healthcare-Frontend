import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import
import axios from "axios";
import Register from "./components/RegisterComponent";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/LoginComponent";
import Logout from "./components/LogoutComponent";
import Sidebar from "./components/Sidebar";
import DashboardPatient from "./pages/DashboardPatient";
import DashboardAdmin from "./pages/DashboardAdmin";
import DoctorsList from "./pages/DoctorList";
import PatientsList from "./pages/PatientList";
import AdminsList from "./pages/AdminList";
import Profile from "./pages/Profile";
import UpdateProfile from "./pages/ProfileUpdate";
import "../src/index.css";
import AppointmentsList from "./pages/AppointmentList";
import DoctorsApproveList from "./pages/DoctorApproveList";
import AppointmentApproveList from "./pages/AppointmentApproveList";
import AppointmentReapproveList from "./pages/AppointmentReapproveList";
import CreateDoctor from "./pages/CreateDoctor";
import DoctorListPatient from "./pages/DoctorListPatient";
import MakeAppointment from "./pages/MakeAppointment";
import DashboardDoctor from "./pages/DashboardDoctor";
import MyPrescriptions from "./pages/MyPrescription";
import AppointmentReschedule from "./pages/AppointmentReschedule";
import InstructionPage from "./pages/InstructionPage";
import PaymentPage from "./pages/Payment";
import UpcomingAppointmentsList from "./pages/UpcomingAppointments";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && isTokenExpired(storedToken)) {
      handleLogout();
    } else {
      setToken(storedToken);
    }
  }, []);

  const isTokenExpired = (token) => {
    try {
      const decoded = jwtDecode(token); // Updated to use jwtDecode
      return decoded.exp * 1000 < Date.now(); // Check if token expiry is in the past
    } catch (error) {
      console.error("Invalid token:", error);
      return true; // Treat invalid token as expired
    }
  };

  const handleLogin = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <Router>
      <HeaderComponent />
      <div className={`${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <main className="content-container">
          {token && <Sidebar setIsSidebarOpen={setIsSidebarOpen} />}
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/dashboard" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><DashboardRouter /></ProtectedRoute>}/>
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route path="/doctors-list" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><DoctorsList /></ProtectedRoute>}/>
            <Route path="/make-appointment/:doctorId" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><MakeAppointment/></ProtectedRoute>}/>
            <Route path="/doctor-list" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><DoctorListPatient/></ProtectedRoute>}/>
            <Route path="/admins-list" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><AdminsList /></ProtectedRoute>}/>
            <Route path="/create-doctor" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><CreateDoctor/></ProtectedRoute>}/>
            <Route path="/patients-list" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><PatientsList /></ProtectedRoute>}/>
            <Route path="/appointments-list" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><AppointmentsList/></ProtectedRoute>}/>
            <Route path="/upcoming-appointments-list" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><UpcomingAppointmentsList/></ProtectedRoute>}/>
            <Route path="/doctors-approve-list" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><DoctorsApproveList/></ProtectedRoute>}/>
            <Route path="/appointment-approve-list" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><AppointmentApproveList/></ProtectedRoute>}/>
            <Route path="/appointment-reapprove-list" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><AppointmentReapproveList/></ProtectedRoute>}/>
            <Route path="/profile" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><Profile /></ProtectedRoute>} />
            <Route path="/patient-prescriptions" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><MyPrescriptions /></ProtectedRoute>} />
            <Route path="/appointment-reschedule" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><AppointmentReschedule /></ProtectedRoute>} />
            <Route path="/instruction" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><InstructionPage /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><PaymentPage /></ProtectedRoute>} />
            <Route path="/update-profile/:userId/:userType" element={<ProtectedRoute token={token} isTokenExpired={isTokenExpired}><UpdateProfile/></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
      <FooterComponent />
    </Router>
  );
};

const DashboardRouter = () => {
  const userType = localStorage.getItem("userType");
  if (userType === "ADMIN") {
    return <DashboardAdmin />;
  } else if (userType === "PATIENT") {
    return <DashboardPatient />;
  }
  return <DashboardDoctor />;
};

export default App;
