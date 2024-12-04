import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Register.css"; // Import custom styles

function Register({ onRegister }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [navigate]);

  async function handleRegister(event) {
    event.preventDefault();

    // Password confirmation check
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await axios
        .post("http://localhost:8000/api/v1/user/register", {
          firstName,
          lastName,
          mobile,
          email,
          password,
        })
        .then((res) => {
          if (res.data.success) {
            setSuccessMessage("Registration successful! Please login.");
            setErrorMessage(""); // Clear any error messages
            navigate("/login"); // Redirect to login page after successful registration
          } else {
            setErrorMessage(res.data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Registration failed. Please try again."); // Handle server or network error
        });
    } catch (err) {
      setErrorMessage("An error occurred: " + err);
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
        {successMessage && (
          <div className="alert alert-success">{successMessage}</div>
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
              className="form-control"
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              required
            />
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
