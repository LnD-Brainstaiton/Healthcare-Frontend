import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css"; // Import custom styles

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  // Check if the user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [navigate]);

  async function login(event) {
    event.preventDefault();
    try {
      await axios
        .post("http://localhost:8000/api/v1/user/token", {
          userName: username,
          password: password,
        })
        .then((res) => {
          if(res.data.data == null) {
           setErrorMessage(res.data.responseMessage);
          } else if (res.data.data.token != null) {
            const token = res.data.data.token;
            const usertype = res.data.data.userType;
            const userId = res.data.data.userId;
            localStorage.setItem("token", token);
            localStorage.setItem("userType", usertype);
            localStorage.setItem("userId", userId);
            onLogin(token); // Update token state in parent (App.js)
            navigate("/dashboard");
          } 
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Login failed. Please try again."); // Handle server or network error
        });
    } catch (err) {
      setErrorMessage("An error occurred: " + err);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login</h2>
        <hr />

        {errorMessage && (
          <div className="alert alert-danger">{errorMessage}</div>
        )}

        <form onSubmit={login}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter mobile"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
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

          <button type="submit" className="btn btn-primary btn-block">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
