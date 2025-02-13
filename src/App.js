import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import
import axios from "axios";
import Register from "./components/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Logout from "./components/Logout";
import Sidebar from "./components/Sidebar";
import DashboardPatient from "./pages/DashboardPatient";
import DashboardAdmin from "./components/DashboardAdmin";
import DoctorsList from "./components/Doctors";
import PatientsList from "./components/Patients";
import Profile from "./components/Profile";
import UpdateProfile from "./components/ProfileUpdate";
import AppointmentsList from "./components/AppointmentHistory";
import DoctorsApproveList from "./components/PendingDoctors";
import AppointmentApproveList from "./components/PendingAppointments";
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
import VerifyOtp from "./pages/VerifyOtp";
import DoctorView from "./components/DoctorView";
import AdminsList from "./components/Admins";
import DoctorRegisterLevel2 from "./components/DoctorRegisterLevel2";
import ChangePassword from "./components/ChangePassword";
import HomePage from "./components/HomePage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authLevel, setAuthLevel] = useState(
    localStorage.getItem("doctorAuthLevel")
  );
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const checkTokenExpiry = setInterval(() => {
      const storedToken = localStorage.getItem("token");
      if (storedToken && isTokenExpired(storedToken)) {
        handleLogout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTokenExpiry); // Cleanup on unmount
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state
  };

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

  const closePopup = () => {
    setAuthLevel(0);
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex flex-grow ">
          {token && <Sidebar isOpen={isSidebarOpen} />}
          <div className="flex-grow overflow-auto">
            {token && authLevel == 1 && (
              <div
                // onClick={register}
                className="relative bg-errorMessageBackground text-4xl text-errorMessage text-center m-4 p-8 shadow-custom-dark flex-col justify-center items-center rounded-xl"
              >
                <h1>
                  <Link to="/doctor-register-level2">
                    Complete your profile
                  </Link>
                </h1>
                <button onClick={closePopup} className="absolute top-4 right-4">
                  ×
                </button>
              </div>
            )}
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/"
                element={
                  <>
                    {userType === "ADMIN" && (
                      <ProtectedRoute
                        token={token}
                        isTokenExpired={isTokenExpired}
                      >
                        <DashboardAdmin />
                      </ProtectedRoute>
                    )}
                    {userType === "DOCTOR" && (
                      <ProtectedRoute
                        token={token}
                        isTokenExpired={isTokenExpired}
                      >
                        <DashboardDoctor />
                      </ProtectedRoute>
                    )}
                    {userType !== "DOCTOR" && userType !== "ADMIN" && (
                      <HomePage />
                    )}
                  </>
                }
              />

              <Route
                path="/logout"
                element={<Logout onLogout={handleLogout} />}
              />
              <Route
                path="/doctors-list"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <DoctorsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/make-appointment/:doctorId"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <MakeAppointment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor-list"
                element={
                  // <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                  <DoctorListPatient />
                  // </ProtectedRoute>
                }
              />
              <Route
                path="/admins-list"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <AdminsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-doctor"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <CreateDoctor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patients-list"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <PatientsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointments-list"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <AppointmentsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/upcoming-appointments-list"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <UpcomingAppointmentsList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctors-approve-list"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <DoctorsApproveList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment-approve-list"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <AppointmentApproveList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment-reapprove-list"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <AppointmentReapproveList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient-prescriptions"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <MyPrescriptions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/appointment-reschedule"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <AppointmentReschedule />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/instruction"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <InstructionPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <PaymentPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-profile/:userId/:userType"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <UpdateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor-profile/:doctorId/:patientId"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <DoctorView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/doctor-register-level2"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <DoctorRegisterLevel2 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute token={token} isTokenExpired={isTokenExpired}>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
