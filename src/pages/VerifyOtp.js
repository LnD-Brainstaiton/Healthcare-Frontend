import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function VerifyOtp() {
  const location = useLocation();
  const navigate = useNavigate();
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { firstName, lastName, mobile, email, password, sessionId, isDoctor } =
    location.state || {};

  if (!email || !mobile) {
    navigate("/register");
  }

  async function handleVerifyOtp(event) {
    event.preventDefault();

    try {
      const userName = mobile;
      // Add OTP verification logic here, e.g., API call to verify OTP
      const otpResponse = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/validate-otp`,
        { userName, generatedOtp, sessionId }
      );
      console.log(otpResponse.data.data);

      if (otpResponse.data.data === true) {
        // Proceed with registration
        if (isDoctor) {
          await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/init/request`,
            { firstName, lastName, mobile, email, password }
          );
        } else {
          await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/patient/register`,
            { firstName, lastName, mobile, email, password }
          );
        }

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
    <div className="flex items-center justify-center p-40">
      <div className="bg-white shadow-lg rounded-xl p-10 w-96 text-center transition-all duration-300 ease-in-out">
        <h2 className="text-2xl text-primaryText p-4 font-bold">Verify OTP</h2>
        <hr className="mb-4" />

        {errorMessage && (
          <div className="p-2 mb-4 rounded-lg font-bold bg-errorMessageBackground text-errorMessage">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="p-2 mb-4 rounded-lg font-bold bg-successMessageBackground text-successMessage">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleVerifyOtp}>
          <div className="mb-4">
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-gray-300 text-base bg-gray-100 transition-colors duration-300 ease-in-out focus:border-blue-500"
              placeholder="Enter OTP"
              value={generatedOtp}
              onChange={(event) => setGeneratedOtp(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-tealBlueHover w-full text-2xl text-white hover:bg-tealBlue font-bold p-2 rounded-xl  hover:shadow-lg hover:scale-105 transform transition-all duration-200
"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyOtp;
