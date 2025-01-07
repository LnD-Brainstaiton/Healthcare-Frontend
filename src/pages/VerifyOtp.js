import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { firstName, lastName, mobile, email, password, sessionId } =
    location.state || {};

  if (!email || !mobile) {
    navigate("/register");
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();

    try {
      const userName = mobile;
      // Add OTP verification logic here, e.g., API call to verify OTP
      console.log(userName, generatedOtp, sessionId);
      const otpResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/tfa/validate-otp`,
        { userName, generatedOtp, sessionId }
      );
      console.log(otpResponse);

      if (otpResponse.status === 200) {
        // Proceed with registration
        await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/patient/register`,
          { firstName, lastName, mobile, email, password }
        );

        setSuccessMessage("Registration successful! Please login.");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("OTP verification failed. Please try again.");
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Verify OTP</h2>
        <hr />

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
        )}

        <form onSubmit={handleVerifyOtp}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter OTP"
              value={generatedOtp}
              onChange={(event) => setGeneratedOtp(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
