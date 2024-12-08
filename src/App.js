import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
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

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [token]);

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
      <div className="app">
        {token && <Sidebar />}
        <main className="content-container">
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
            <Route
              path="/doctors-list"
              element={
                <ProtectedRoute>
                  <DoctorsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admins-list"
              element={
                <ProtectedRoute>
                  <AdminsList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patients-list"
              element={
                <ProtectedRoute>
                  <PatientsList />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
      <FooterComponent />
    </Router>
  );
  
};

const DashboardRouter = () => {

  const userType = localStorage.getItem('userType');

  
  // Redirect to the appropriate dashboard
  if (userType === 'ADMIN')  {
    console.log(userType);
    return <DashboardAdmin />
  }
  else if (userType === 'PATIENT') {
    console.log(userType);
    return <DashboardPatient />
  }
    
  return null; // Render nothing; just handle redirection
};
export default App;
