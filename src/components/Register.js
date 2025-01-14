import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
          },
          body: JSON.stringify({ mobile: mobileNumber }),
        }
      );
      console.log("Response: ", response);

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
    <div className="flex items-center justify-center p-10">
      <div className="bg-white shadow-lg rounded-xl p-10 w-96 text-center transition-all duration-300 ease-in-out">
        <h2 className="text-2xl text-primaryText p-4 font-bold">Register</h2>
        <hr className="mb-4" />

        {errorMessage && (
          <div className="p-2 mb-4 rounded-lg font-bold bg-errorMessageBackground text-errorMessage">
            {errorMessage}
          </div>
        )}
        {!isMobileValid && (
          <div className="p-2 mb-4 rounded-lg font-bold bg-errorMessageBackground text-errorMessage">
            {mobileError}
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center fixed w-full h-full bg-white top-0 left-0 opacity-55">
            <div className="w-16 h-16 border-4 border-t-blue-600 m-8 rounded-full animate-spin "></div>
            <div className="text-4xl text-blue-600 animate-pulse">
              Loading, please wait...
            </div>
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
              placeholder="Enter First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
              placeholder="Enter Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
              placeholder="Enter Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
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

          <div className="mb-4">
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-teal-600  w-full text-2xl text-primaryText hover:text-primaryTextHover font-bold p-2 rounded-xl"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
