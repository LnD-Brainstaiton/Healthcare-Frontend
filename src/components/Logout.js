import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LogoutComponent = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear JWT token from localStorage
    localStorage.removeItem("token");

    // Call the onLogout function to update the state in App.js
    onLogout();

    // Redirect to login page
    navigate("/");
  }, [navigate, onLogout]);

  return (
    <div>
      <h2>Logging out...</h2>
    </div>
  );
};

export default LogoutComponent;
