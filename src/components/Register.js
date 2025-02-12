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
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loader
  const [isCheckingMobile, setIsCheckingMobile] = useState(false); // Mobile validation status
  const [isCheckingEmail, setIsCheckingEmail] = useState(false); // Mobile validation status

  const [isDoctor, setIsDoctor] = useState(false);
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

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (mobile) {
        checkEmailExists(mobile);
      }
    }, 500);

    return () => clearTimeout(debounceTimeout);
  }, [email]);

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

  const checkEmailExists = async (mobileNumber) => {
    setIsCheckingEmail(true); // Start validation
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/check-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );
      console.log("Response: ", response);

      if (!response.ok) {
        throw new Error("Failed to check mobile number");
      }

      const data = await response.json();
      if (data.data === true) {
        setEmailError("Email already exists");
        setIsEmailValid(false);
      } else {
        setEmailError("");
        setIsEmailValid(true);
      }
    } catch (err) {
      setEmailError("Error validating mobile number");
      setIsEmailValid(false);
    } finally {
      setIsCheckingEmail(false); // End validation
    }
  };

  const toggleRegister = (flag) => {
    setIsDoctor(flag);
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
          state: {
            firstName,
            lastName,
            mobile,
            email,
            password,
            sessionId,
            isDoctor,
          },
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
      <div className="bg-white  shadow-lg rounded-xl p-10 w-96 text-center transition-all duration-300 ease-in-out">
        <h2 className="text-2xl text-primaryText p-4 font-bold">Sign up</h2>
        <hr className="mb-4" />
        <div className="p-2 rounded-lg">
          <div className="flex mb-4">
            <button
              className={`w-1/2 p-2 text-xl font-bold rounded-l-lg transition-all ${
                isDoctor
                  ? "bg-teal-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => toggleRegister(true)}
            >
              Doctor
            </button>
            <button
              className={`w-1/2 p-2 text-xl font-bold rounded-r-lg transition-all ${
                isDoctor
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-teal-500 text-white"
              }`}
              onClick={() => toggleRegister(false)}
            >
              Patient
            </button>
          </div>

          <div className="">
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
            {!isEmailValid && (
              <div className="p-2 mb-4 rounded-lg font-bold bg-errorMessageBackground text-errorMessage">
                {emailError}
              </div>
            )}
            {isLoading && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 border-4 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-white mt-4 text-xl font-medium">
                    Please wait...
                  </p>
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
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="bg-tealBlueHover w-full text-2xl text-white hover:bg-tealBlue font-bold p-2 rounded-xl  hover:shadow-lg hover:scale-105 transform transition-all duration-200
"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
