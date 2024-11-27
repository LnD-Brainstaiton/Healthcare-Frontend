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
      navigate("/users"); // Redirect to users list if logged in
    }
  }, [navigate]);

  async function login(event) {
    event.preventDefault();
    try {
      await axios
        .post("http://localhost:8081/....", {
          username: username,
          password: password,
        })
        .then((res) => {
          if (res.data.data != null) {
            const token = res.data.data.token;
            localStorage.setItem("token", token);
            onLogin(token); // Update token state in parent (App.js)
            navigate("/users");
          } else {
            setErrorMessage(res.data.message);
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
        <div >
          <h2>Login</h2>
          <hr />
        </div>

        <div className="login-body">
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}

          <form onSubmit={login}>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
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
    </div>
  );
}

export default Login;
