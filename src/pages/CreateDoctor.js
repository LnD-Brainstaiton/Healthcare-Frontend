import React, { useState, useEffect } from "react";
import "../styles/ProfileUpdate.css";
import { useParams } from "react-router-dom";
import logo from "../assets/Logo.png";

const CreateDoctor = () => {
  //   const { userId } = useParams();
  //   const { userType } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    // password: "",
    // confirmPassword: "",
    designation: "", // Added for doctor
    department: "", // Added for doctor
    specialities: "", // Added for doctor
    fee: "", // Added for doctor
    timeSlots: [], // Add this for time slots
  });

  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: "",
    endTime: "",
    weekdays: [],
  });

  const [weekdays, setWeekdays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [designationOptions, setDesignationOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isMobileValid, setIsMobileValid] = useState(true); // To track mobile validation status

  useEffect(() => {
    // Fetch dropdown options
    const fetchDropdownOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Fetch department options
        const departmentRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/department-options`,
          { headers }
        );
        const departmentData = await departmentRes.json();
        setDepartmentOptions(departmentData.data.departments || []);

        // Fetch designation options
        const designationRes = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/designation-options`,
          { headers }
        );
        const designationData = await designationRes.json();
        setDesignationOptions(designationData.data.designations || []);
      } catch (err) {
        setError("Failed to fetch dropdown options");
      }
    };

    fetchDropdownOptions();
  }, []);

  const addTimeSlot = () => {
    if (
      newTimeSlot.startTime &&
      newTimeSlot.endTime &&
      newTimeSlot.weekdays.length > 0
    ) {
      setFormData({
        ...formData,
        timeSlots: [...formData.timeSlots, newTimeSlot],
      });
      setNewTimeSlot({ startTime: "", endTime: "", weekdays: [] });
    } else {
      alert("Please fill in all time slot fields.");
    }
  };

  const handleWeekdayToggle = (day) => {
    setNewTimeSlot((prev) => ({
      ...prev,
      weekdays: prev.weekdays.includes(day)
        ? prev.weekdays.filter((d) => d !== day)
        : [...prev.weekdays, day],
    }));
  };

  const removeTimeSlot = (index) => {
    setFormData({
      ...formData,
      timeSlots: formData.timeSlots.filter((_, i) => i !== index),
    });
  };

  const handleTimeSlotChange = (e) => {
    const { name, value } = e.target;
    setNewTimeSlot({ ...newTimeSlot, [name]: value });
    console.log(formData.timeSlots);
  };

  const handleWeekdayChange = (index, day) => {
    const updatedTimeSlots = formData.timeSlots.map((slot, i) => {
      if (i === index) {
        const weekdays = slot.weekdays.includes(day)
          ? slot.weekdays.filter((d) => d !== day)
          : [...slot.weekdays, day];
        return { ...slot, weekdays };
      }
      return slot;
    });
    setFormData({ ...formData, timeSlots: updatedTimeSlots });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Trigger mobile validation on change
    if (name === "mobile") {
      checkMobileExists(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Password validation
    // if (formData.password !== formData.confirmPassword) {
    //   setError("New password and confirm password do not match.");
    //   return;
    // }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const staticRequestBody = {
        featureCode: "DOCTOR", // Replace with your actual feature code
        operationType: "create", // Replace with your actual operation type
        message: "", // Replace with your actual message
        requestUrl: "/api/v1/user/doctor/create", // Replace with your actual request URL
        requestId: null, // Replace with your actual request ID
      };

      const requestBody = {
        ...staticRequestBody,
        data: JSON.stringify(formData), // This is the dynamic part
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

      if (!response.ok) {
        throw new Error("Failed to create profile");
      }

      setSuccess("Profile created successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const checkMobileExists = async (mobileNumber) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/check-mobile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mobile: mobileNumber,
            userType: "doctor",
            userId: null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check mobile number");
      }

      const data = await response.json();
      console.log(mobileNumber, data.data);
      if (data.data === true) {
        setError("Mobile number already exists");
        setIsMobileValid(false);
      } else {
        setError(null);
        setIsMobileValid(true);
      }
    } catch (err) {
      setError("Error validating mobile number");
      setIsMobileValid(false);
    }
  };

  return (
    <div className="update-profile-container">
      <div className="update-profile-card">
        <h2 className="update-profile-header">Create Doctor</h2>
        <form className="update-profile-details" onSubmit={handleSubmit}>
          {/* Common fields */}
          <div className="update-profile-field">
            <label className="update-field-label">First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="update-profile-field">
            <label className="update-field-label">Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter last name"
              required
            />
          </div>
          <div className="update-profile-field">
            <label className="update-field-label">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter email"
              required
            />
          </div>
          <div className="update-profile-field">
            <label className="update-field-label">Phone:</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="update-profile-field">
            <label className="update-field-label">Designation:</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="update-input-field"
            >
              <option value="">Select Designation</option>
              {designationOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="update-profile-field">
            <label className="update-field-label">Department:</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="update-input-field"
            >
              <option value="">Select Department</option>
              {departmentOptions.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="update-profile-field">
            <label className="update-field-label">Specialties:</label>
            <input
              type="text"
              name="specialities"
              value={formData.specialities}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter specialties"
            />
          </div>
          <div className="update-profile-field">
            <label className="update-field-label">Fee:</label>
            <input
              type="text"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter fee"
            />
          </div>

          <div className="time-slot-section">
            <h3 className="time-slot-header">Add Time Slots</h3>
            <div className="time-slot-inputs">
              <input
                type="time"
                name="startTime"
                value={newTimeSlot.startTime}
                onChange={handleTimeSlotChange}
                className="time-slot-input"
                placeholder="Start Time"
              />
              <input
                type="time"
                name="endTime"
                value={newTimeSlot.endTime}
                onChange={handleTimeSlotChange}
                className="time-slot-input"
                placeholder="End Time"
              />
              <div className="weekday-selection">
                {weekdays.map((day) => (
                  <label key={day} className="weekday-label">
                    <input
                      type="checkbox"
                      checked={newTimeSlot.weekdays.includes(day)}
                      onChange={() => handleWeekdayToggle(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={addTimeSlot}
                className="add-time-slot-btn"
              >
                Add Time Slot
              </button>
            </div>
            <div className="time-slot-list">
              {formData.timeSlots.map((slot, index) => (
                <div key={index} className="time-slot-item">
                  <span>{`${slot.startTime} - ${
                    slot.endTime
                  } (${slot.weekdays.join(", ")})`}</span>
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="remove-time-slot-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Password fields */}
          {/* <div className="update-profile-field">
            <label className="update-field-label">New Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Enter new password"
              // required
            />
          </div>

          <div className="update-profile-field">
            <label className="update-field-label">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="update-input-field"
              placeholder="Confirm new password"
              // required
            />
          </div> */}

          <div>
            <button type="submit" className="update-update-btn">
              Save Changes
            </button>
          </div>
          <div>
            {error && <p className="update-error-message">{error}</p>}
            {success && <p className="update-success-message">{success}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDoctor;
