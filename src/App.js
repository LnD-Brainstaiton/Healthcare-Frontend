import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Register from "./components/RegisterComponent";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/LoginComponent";
import Logout from "./components/LogoutComponent";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

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
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/logout" element={<Logout onLogout={handleLogout} />} />
          </Routes>
        </main>
      </div>
      <FooterComponent />
    </Router>
  );
}

export default App;
