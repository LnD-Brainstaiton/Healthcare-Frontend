import React, { useState, useEffect } from "react";
import "../styles/ProfileUpdate.css";
import { useParams } from "react-router-dom";
import logo from "../assets/Logo.png";

const UpdateProfile = () => {
  const { userId } = useParams(); 
  const { userType } = useParams();  
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    adminId: "",
    patientId: "",
    doctorId: "",
    password: "",
    confirmPassword: "",
    gender: "", // Added for patient
    age: "",    // Added for patient
    address: "", // Added for patient
    nid: "",    // Added for patient
    bloodGroup: "", // Added for patient
    designation: "", // Added for doctor
    department: "",  // Added for doctor
    specialities: "", // Added for doctor
    fee: ""      // Added for doctor
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [userType, setUserType] = useState(localStorage.getItem("userType")?.toLowerCase());
  const [genderOptions, setGenderOptions] = useState([]);
  const [bloodGroupOptions, setBloodGroupOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [isMobileValid, setIsMobileValid] = useState(true); // To track mobile validation status

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }
        
        const response = await fetch(`http://localhost:8000/api/v1/user/${userType}/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setFormData({
          firstname: data.data.firstname,
          lastname: data.data.lastname,
          email: data.data.email,
          mobile: data.data.mobile,
          adminId: data.data.adminId,
          doctorId: data.data.doctorId,
          patientId: data.data.patientId,
          password: "",
          confirmPassword: "",
          gender: data.data.gender || "",
          age: data.data.age || "",
          address: data.data.address || "",
          nid: data.data.nid || "",
          bloodGroup: data.data.bloodGroup || "",
          designation: data.data.designation || "",
          department: data.data.department || "",
          specialities: data.data.specialities || "",
          fee: data.data.fee || ""
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch dropdown options
    const fetchDropdownOptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        
        // Fetch gender options
        const genderRes = await fetch("http://localhost:8000/api/v1/user/gender-options", { headers });
        const genderData = await genderRes.json();
        setGenderOptions(genderData.data.gender || []);

        // Fetch blood group options
        const bloodGroupRes = await fetch("http://localhost:8000/api/v1/user/blood-group-options", { headers });
        const bloodGroupData = await bloodGroupRes.json();
        setBloodGroupOptions(bloodGroupData.data.bloodGroups || []);

        // Fetch department options
        const departmentRes = await fetch("http://localhost:8000/api/v1/user/department-options", { headers });
        const departmentData = await departmentRes.json();
        setDepartmentOptions(departmentData.data.departments || []);

        // Fetch designation options
        const designationRes = await fetch("http://localhost:8000/api/v1/user/designation-options", { headers });
        const designationData = await designationRes.json();
        setDesignationOptions(designationData.data.designations || []);
      } catch (err) {
        setError("Failed to fetch dropdown options");
      }
    };

    fetchUserProfile();
    fetchDropdownOptions();
  }, [userId, userType]);

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
    if (formData.password !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // const userType = localStorage.getItem("userType").toLocaleLowerCase();

      const response = await fetch(`http://localhost:8000/api/v1/user/${userType}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess("Profile updated successfully!");
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
      
      const response = await fetch(`http://localhost:8000/api/v1/user/check-mobile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mobile: mobileNumber,
          userType: userType,
          userId: userId
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to check mobile number");
      }

      const data = await response.json();
      console.log(mobileNumber,data.data);
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

  // useEffect(() => {
  //     checkMobileExists(formData.mobile); // Refetch when filters change
  //   }, [formData.mobile]);

  if (loading) {
    return <div className="profile-container">Loading profile...</div>;
  }

  return (
    <div className="update-profile-container">
      <div className="update-profile-card">
        <div className="update-profile-photo-container">
          <img src={logo} alt="Profile Photo" className="update-profile-photo" />
        </div>
        <h2 className="update-profile-header">Update Profile</h2>
        <form className="update-profile-details" onSubmit={handleSubmit}>

          {/* Common fields */}
          <div className="update-profile-field">
            <label className="update-field-label">First Name:</label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
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
              name="lastname"
              value={formData.lastname}
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

          {/* Conditionally render fields based on userType */}
          {userType === "patient" && (
            <>
              <div className="update-profile-field">
                <label className="update-field-label">Gender:</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="update-input-field"
                >
                  <option value="">Select Gender</option>
                  {genderOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="update-profile-field">
                <label className="update-field-label">Age:</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="update-input-field"
                  placeholder="Enter age"
                />
              </div>
              <div className="update-profile-field">
                <label className="update-field-label">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="update-input-field"
                  placeholder="Enter address"
                />
              </div>
              <div className="update-profile-field">
                <label className="update-field-label">NID:</label>
                <input
                  type="text"
                  name="nid"
                  value={formData.nid}
                  onChange={handleChange}
                  className="update-input-field"
                  placeholder="Enter NID"
                />
              </div>
              <div className="update-profile-field">
                <label className="update-field-label">Blood Group:</label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="update-input-field"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroupOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {userType === "doctor" && (
            <>
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
                    <option key={index} value={option}>{option}</option>
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
                    <option key={index} value={option}>{option}</option>
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
            </>
          )}

          {/* Password fields */}
          <div className="update-profile-field">
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
          </div>

          <div>
            <button type="submit" className="update-update-btn">Save Changes</button>
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

export default UpdateProfile;
