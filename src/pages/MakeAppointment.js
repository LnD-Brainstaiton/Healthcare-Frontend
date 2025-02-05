import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  UserCircle,
  AlertCircle,
} from "lucide-react";

const MakeAppointment = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const doctorInfo = location.state?.doctorInfo;
  const [genderOptions] = useState(["MALE", "FEMALE"]);

  const [formData, setFormData] = useState({
    patientFirstName: "",
    patientLastName: "",
    patientEmail: "",
    patientMobile: "",
    patientGender: "",
    patientAge: "",
    doctorId: doctorId,
    patientId: "",
    doctorFirstName: doctorInfo?.firstname || "",
    doctorLastName: doctorInfo?.lastname || "",
    designation: doctorInfo?.designation || "",
    department: doctorInfo?.department || "",
    specialities: doctorInfo?.specialities || "",
    fee: doctorInfo?.fee || "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    return localStorage.getItem("userId");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "appointmentDate") {
      fetchAvailableTimes(value);
    }
  };

  const fetchAvailableTimes = async (selectedDate) => {
    if (!selectedDate) {
      setAvailableTimes([]);
      return;
    }

    setIsLoadingTimes(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/time-slot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId: doctorId,
            date: selectedDate,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.responseCode === "S100000") {
        setAvailableTimes(data.data?.timeSlotList || []);
      } else if (response.ok && data.responseCode === "E000101") {
        setAvailableTimes([]);
      } else {
        setError(data.responseMessage || "Failed to fetch available times");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingTimes(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const appointmentData = {
        doctorId: formData.doctorId,
        appointmentDate: formData.appointmentDate,
        appointmentTime: formData.appointmentTime,
        patientName: `${formData.patientFirstName} ${formData.patientLastName}`,
        patientEmail: formData.patientEmail,
        patientAge: formData.patientAge,
        patientGender: formData.patientGender,
        patientId: getUserIdFromToken(),
        patientContactNo: formData.patientMobile,
        fee: formData.fee,
        reason: formData.reason,
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user//admin/temp/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            featureCode: "APPOINTMENT",
            operationType: "create",
            message: "",
            requestUrl: "/api/v1/appointment/create",
            requestId: null,
            data: JSON.stringify(appointmentData),
          }),
        }
      );

      const data = await response.json();

      if (data.responseCode === "S100000") {
        setSuccess("Appointment booked successfully!");
        setTimeout(() => {
          navigate("/instruction");
        }, 2000);
      } else {
        setError(data.responseMessage || "Failed to book appointment");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white text-center">
              Book Appointment
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Doctor Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <UserCircle className="w-6 h-6 text-teal-500" />
                Doctor Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={`${formData.doctorFirstName} ${formData.doctorLastName}`}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Fee
                  </label>
                  <input
                    type="text"
                    value={formData.fee}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-100 text-gray-700"
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-teal-500" />
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <select
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    disabled={!availableTimes.length}
                    required
                  >
                    <option value="">Select a time</option>
                    {isLoadingTimes ? (
                      <option>Loading times...</option>
                    ) : (
                      availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-teal-500" />
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="patientFirstName"
                    value={formData.patientFirstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="patientLastName"
                    value={formData.patientLastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="patientEmail"
                    value={formData.patientEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    name="patientMobile"
                    value={formData.patientMobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="patientGender"
                    value={formData.patientGender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Gender</option>
                    {genderOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Reason for Visit */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-teal-500" />
                Reason for Visit
              </h3>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                rows="4"
                placeholder="Please describe your reason for visit..."
                required
              />
            </div>

            {/* Error and Success Messages */}
            {(error || success) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg ${
                  error
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                <div className="flex items-center gap-2">
                  {error ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    <Clock className="w-5 h-5" />
                  )}
                  <p className="font-medium">{error || success}</p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="bg-tealBlueHover w-full text-2xl text-white hover:bg-tealBlue font-bold p-2 rounded-xl hover:shadow-lg hover:scale-105 transform transition-all duration-200"

                // className="px-8 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-teal-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
              >
                Book Appointment
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default MakeAppointment;
