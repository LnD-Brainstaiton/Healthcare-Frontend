import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";

const UpdateProfile = () => {
  const { userId, userType } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    gender: "",
    age: "",
    address: "",
    nid: "",
    bloodGroup: "",
    designation: "",
    department: "",
    specialities: "",
    fee: "",
    registrationNo: "",
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOptions, setDropdownOptions] = useState({
    genders: [],
    bloodGroups: [],
    departments: [],
    designations: [],
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Fetch user profile
        const profileResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/${userType}/${userId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch dropdown options
        const optionsResponse = await Promise.all([
          fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/gender-options`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/blood-group-options`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/department-options`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
          fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/designation-options`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        const profileData = await profileResponse.json();
        const [genderData, bloodGroupData, departmentData, designationData] =
          await Promise.all(optionsResponse.map((res) => res.json()));

        setFormData({
          firstname: profileData.data.firstname,
          lastname: profileData.data.lastname,
          email: profileData.data.email,
          mobile: profileData.data.mobile,
          gender: profileData.data.gender || "",
          age: profileData.data.age || "",
          address: profileData.data.address || "",
          nid: profileData.data.nid || "",
          bloodGroup: profileData.data.bloodGroup || "",
          designation: profileData.data.designation || "",
          department: profileData.data.department || "",
          specialities: profileData.data.specialities || "",
          fee: profileData.data.fee || "",
        });

        setDropdownOptions({
          genders: genderData.data.gender || [],
          bloodGroups: bloodGroupData.data.bloodGroups || [],
          departments: departmentData.data.departments || [],
          designations: designationData.data.designations || [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/${userType}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-100 pt-24 p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col w-full bg-white shadow-md rounded-lg p-6 space-y-6 mx-auto">
        <div className="flex flex-col items-center">
          <img
            src={logo}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-teal-500"
          />
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mt-4">
            Update Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="text-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
            <InputField
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <InputField
            label="Phone"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          {userType === "patient" && (
            <>
              <SelectField
                label="Gender"
                name="gender"
                value={formData.gender}
                options={dropdownOptions.genders}
                onChange={handleChange}
              />
              <InputField
                label="Age"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
              <InputField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <InputField
                label="NID"
                name="nid"
                value={formData.nid}
                onChange={handleChange}
              />
              <SelectField
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                options={dropdownOptions.bloodGroups}
                onChange={handleChange}
              />
            </>
          )}

          {userType === "doctor" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  options={dropdownOptions.designations}
                  onChange={handleChange}
                />
                <SelectField
                  label="Department"
                  name="department"
                  value={formData.department}
                  options={dropdownOptions.departments}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Specialties"
                  name="specialities"
                  value={formData.specialities}
                  onChange={handleChange}
                />
                <InputField
                  label="Fee"
                  name="fee"
                  value={formData.fee}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-2/3 lg:w-2/12 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-300"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({ label, type = "text", ...props }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 font-medium mb-1">{label}</label>
    <input
      type={type}
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xl"
      {...props}
    />
  </div>
);

const SelectField = ({ label, options, ...props }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 font-medium mb-1">{label}</label>
    <select
      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-xl"
      {...props}
    >
      <option value="">Select {label}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

export default UpdateProfile;
