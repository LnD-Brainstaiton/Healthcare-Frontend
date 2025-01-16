import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/DashboardPatient.module.css";
import logo from "../assets/Logo.png";

const DashboardPatient = () => {
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
  }, [navigate]);

  if (!isLoggedIn) {
    return null; // Don't render the dashboard content if the user isn't logged in
  }

  return (
    <div className={styles.dashboard}>
      <h1>Health Care</h1>
      <p>Your one-stop platform for personalized healthcare management.</p>

      <div
        className={styles.featureBooking}
        onClick={() => navigate("/doctor-list")}
      >
        <div className={styles.featureInfo}>
          <h2>Find Doctor & Book Appointment</h2>
        </div>
      </div>
      <div className={styles.dashboardContent}>
        {/* Feature Section 1 */}
        <div className={styles.feature}>
          <img src={logo} alt="Appointment" className={styles.featureIcon} />
          <div className={styles.featureInfo}>
            <h2>Easy Appointment Booking</h2>
            <p>
              Schedule appointments with your preferred doctors in just a few
              clicks.
            </p>
          </div>
        </div>

        {/* Feature Section 2 */}
        <div className={styles.feature}>
          <img
            src={logo}
            alt="Medical Records"
            className={styles.featureIcon}
          />
          <div className={styles.featureInfo}>
            <h2>Secure Medical Records</h2>
            <p>
              Access and manage your medical history securely from anywhere.
            </p>
          </div>
        </div>

        {/* Feature Section 3 */}
        <div className={styles.feature}>
          <img
            src={logo}
            alt="Health Statistics"
            className={styles.featureIcon}
          />
          <div className={styles.featureInfo}>
            <h2>Track Your Health</h2>
            <p>
              Monitor vital health metrics like blood pressure, heart rate, and
              more.
            </p>
          </div>
        </div>

        {/* Feature Section 4 */}
        <div className={styles.feature}>
          <img src={logo} alt="Health Tips" className={styles.featureIcon} />
          <div className={styles.featureInfo}>
            <h2>Personalized Health Tips</h2>
            <p>
              Receive expert health advice tailored to your medical profile.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPatient;
