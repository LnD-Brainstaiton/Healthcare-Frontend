import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/MakeAppointment.module.css";

const MakeAppointment = () => {
  const { doctorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const doctorInfo = location.state?.doctorInfo;
  const [genderOptions, setGenderOptions] = useState(["MALE", "FEMALE"]);

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

  // Function to get the token from localStorage and extract the user ID
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token"); // Replace with your token storage method
    if (!token) {
      throw new Error("No token found");
    }
    const userId = localStorage.getItem("userId");
    return userId; // Assuming the token contains the user ID in the 'id' field
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Fetch available times when a date is selected
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
      console.log(data);
      if (response.ok && data.responseCode === "S100000") {
        if (data != null) {
          setAvailableTimes(data.data.timeSlotList || []); // Assuming `timeSlots` contains the available times
        } else {
          setAvailableTimes([]);
        }
      } else if (response.ok && data.responseCode === "E000101") {
        setAvailableTimes([]);
      } else {
        setAvailableTimes([]);
        setError(data.responseMessage || "Failed to fetch available times");
      }
    } catch (err) {
      setAvailableTimes([]);
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
        patientAge: formData.patientAge, // Defaulting to 35 if age is not provided
        patientGender: formData.patientGender, // Defaulting to "MALE" if not provided
        patientId: getUserIdFromToken(), // Defaulting to "PAT67894" if not provided
        patientContactNo: formData.patientMobile,
        fee: formData.fee, // Defaulting to 150.50 if fee is not provided
        appointmentNo: formData.appointmentNo, // Defaulting to "AP20241225" if not provided
        reason: formData.reason,
      };

      const staticRequestBody = {
        featureCode: "APPOINTMENT", // Replace with your actual feature code
        operationType: "create", // Replace with your actual operation type
        message: "", // Replace with your actual message
        requestUrl: "/api/v1/appointment/create", // Replace with your actual request URL
        requestId: null, // Replace with your actual request ID
      };

      const requestBody = {
        ...staticRequestBody,
        data: JSON.stringify(appointmentData), // This is the dynamic part
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user//admin/temp/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
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
    <div className={styles.appointmentContainer}>
      <div className={styles.appointmentCard}>
        <h2 className={styles.appointmentHeader}>Book Appointment</h2>
        <form className={styles.appointmentForm} onSubmit={handleSubmit}>
          <div className={styles.formColumns}>
            <div className={styles.formColumn}>
              <div className={styles.sectionHeader}>Doctor Information</div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Doctor Name:</label>
                <input
                  type="text"
                  value={`${formData.doctorFirstName} ${formData.doctorLastName}`}
                  className={styles.inputField}
                  disabled
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Designation:</label>
                <input
                  type="text"
                  value={formData.designation}
                  className={styles.inputField}
                  disabled
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Department:</label>
                <input
                  type="text"
                  value={formData.department}
                  className={styles.inputField}
                  disabled
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Fee:</label>
                <input
                  type="text"
                  value={formData.fee}
                  className={styles.inputField}
                  disabled
                />
              </div>

              <div className={styles.sectionHeader}>Appointment Details</div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Date:</label>
                <input
                  type="date"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className={styles.inputField}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Time:</label>
                <select
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  className={styles.inputField}
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
              <div className={styles.sectionHeader}>Reason for Visit</div>
              <div className={styles.formField}>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                  rows="5"
                  placeholder="Please describe your reason for visit..."
                />
              </div>
            </div>

            <div className={styles.formColumn}>
              <div className={styles.sectionHeader}>Patient Information</div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>First Name:</label>
                <input
                  type="text"
                  name="patientFirstName"
                  value={formData.patientFirstName}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Last Name:</label>
                <input
                  type="text"
                  name="patientLastName"
                  value={formData.patientLastName}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Email:</label>
                <input
                  type="email"
                  name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Mobile:</label>
                <input
                  type="text"
                  name="patientMobile"
                  value={formData.patientMobile}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Age:</label>
                <input
                  type="text"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  className={styles.inputField}
                  required
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.fieldLabel}>Gender:</label>

                <select
                  name="patientGender"
                  value={formData.patientGender}
                  onChange={handleChange}
                  className="update-input-field"
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.formFooter}>
            {error && <p className={styles.errorMessage}>{error}</p>}
            {success && <p className={styles.successMessage}>{success}</p>}
            <button type="submit" className={styles.submitButton}>
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeAppointment;
