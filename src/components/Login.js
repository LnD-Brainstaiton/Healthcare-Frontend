import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        .post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user/token`, {
          userName: username,
          password: password,
        })
        .then((res) => {
          if (res.data.data == null) {
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
    <div className="flex items-center justify-center p-40">
      <div className="bg-white shadow-lg rounded-xl p-10 w-96 text-center transition-all duration-300 ease-in-out">
        <h2 className="text-2xl text-primaryText p-4 font-bold">Sign in</h2>
        <hr className="mb-4" />

        {errorMessage && (
          <div className="p-2 mb-4 rounded-lg font-bold bg-errorMessageBackground text-errorMessage">
            {errorMessage}
          </div>
        )}

        <form onSubmit={login}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
              placeholder="Enter id"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
              placeholder="Enter Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-teal-600 bg-gradient-to-r from-tealBlue  to-green-800 w-full text-2xl text-white hover:text-primaryTextHover font-bold p-2 rounded-xl"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
