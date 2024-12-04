import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/Dashboard.css'

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in by checking the token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true); // Set state to true if a token is found
    } else {
      navigate("/login"); // Redirect to login page if no token is found
    }
  }, [navigate]); // Dependency array ensures it runs once when the component mounts

  if (!isLoggedIn) {
    return null; // Don't render the dashboard content if the user isn't logged in
  }

  return (
    <div className="dashboard">
      <h1>Welcome to the Dashboard</h1>
      <p>This is a protected route. Only accessible to logged-in users.</p>

      {/* Add more content or components here, such as user data, statistics, etc. */}
      <div className="dashboard-content">
        <h2>Your Dashboard Overview</h2>
        <p>Here you can view your account details and more.</p>
        {/* Add user-specific information or statistics */}
      </div>
    </div>
  );
};

export default Dashboard;
