import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react"; // Import icons

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  async function login(event) {
    event.preventDefault();
    try {
      await axios
        .post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user/token`, {
          userId: username,
          password: password,
        })
        .then((res) => {
          if (res.data.data == null) {
            setErrorMessage(res.data.responseMessage);
          } else if (res.data.data.token != null) {
            const { token, userType, userId, doctorAuthLevel } = res.data.data;
            localStorage.setItem("token", token);
            localStorage.setItem("userType", userType);
            localStorage.setItem("userId", userId);
            localStorage.setItem("doctorAuthLevel", doctorAuthLevel);
            onLogin(token);
            navigate("/");
          }
        })
        .catch((err) => {
          console.error(err);
          setErrorMessage("Login failed. Please try again.");
        });
    } catch (err) {
      setErrorMessage("An error occurred: " + err);
    }
  }

  return (
    <div className="flex items-center justify-center mt-48 sm:mt-0 p-4 sm:p-40">
      <div className="bg-white shadow-lg rounded-xl p-6 sm:p-10 w-full sm:w-96 text-center transition-all duration-300 ease-in-out">
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

          {/* Password field with toggle visibility */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 pr-10 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
              placeholder="Enter Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="bg-tealBlueHover w-full text-2xl text-white hover:bg-tealBlue font-bold p-2 rounded-xl hover:shadow-lg hover:scale-105 transform transition-all duration-200"
          >
            Sign in
          </button>
        </form>
        {/* Forgot Password Link */}

        <div className="flex justify-between items-center mb-4 text-sm">
          <span></span>

          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
