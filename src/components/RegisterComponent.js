import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMobileValid, setIsMobileValid] = useState(true);
  const [mobileError, setMobileError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loader
  const [isCheckingMobile, setIsCheckingMobile] = useState(false); // Mobile validation status

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (mobile) {
        checkMobileExists(mobile);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [mobile]);

  const checkMobileExists = async (mobileNumber) => {
    setIsCheckingMobile(true); // Start validation
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/check-mobile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
          body: JSON.stringify({ mobile: mobileNumber }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check mobile number");
      }

      const data = await response.json();
      if (data.data === true) {
        setMobileError("Mobile number already exists");
        setIsMobileValid(false);
      } else {
        setMobileError("");
        setIsMobileValid(true);
      }
    } catch (err) {
      setMobileError("Error validating mobile number");
      setIsMobileValid(false);
    } finally {
      setIsCheckingMobile(false); // End validation
    }
  };

  async function handleRegister(event) {
    event.preventDefault();

    setIsLoading(true); // Show loader

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false); // Hide loader
      return;
    }

    // Validate mobile number if not already validated
    if (!isMobileValid) {
      setErrorMessage("Please fix the issues with your mobile number.");
      setIsLoading(false); // Hide loader
      return;
    }

    try {
      const userId = mobile;

      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/generate-otp`,
        { firstName, lastName, userId, email }
      );

      if (response.status === 200) {
        const sessionId = response.data.data.sessionId;
        navigate("/verify-otp", {
          state: { firstName, lastName, mobile, email, password, sessionId },
        });
      } else {
        setErrorMessage("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false); // Hide loader
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Register</h2>
        <hr />

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}
        {isLoading && (
          <div class="loader-container">
            <div class="loader"></div>
            <div class="loader-text">Loading, please wait...</div>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className={`form-control`}
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              required
            />
            {!isMobileValid && (
              <div className="invalid-feedback">{mobileError}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
