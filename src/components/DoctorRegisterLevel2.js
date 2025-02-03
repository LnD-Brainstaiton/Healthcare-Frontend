import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DoctorRegisterLevel2 = () => {
  const navigate = useNavigate();
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const userId = localStorage.getItem("userId");
    return userId;
  };

  const userId = getUserIdFromToken();
  const [formData, setFormData] = useState({
    userId: userId,
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    bloodGroup: "",
    designation: "",
    department: "",
    specialities: "",
    fee: "",
    registrationNo: "",
    timeSlots: [],
    dob: "",
  });

  const [newTimeSlot, setNewTimeSlot] = useState({
    startTime: "",
    endTime: "",
    weekdays: [],
  });

  const [weekdays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOptions, setDropdownOptions] = useState({
    bloodGroups: [],
    departments: [],
    designations: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        // Fetch doctor details
        const doctorResponse = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!doctorResponse.ok) {
          throw new Error("Failed to fetch doctor details");
        }

        const doctorData = await doctorResponse.json();

        console.log(doctorData.data.firstname);
        // Update form data with doctor details
        setFormData((prev) => ({
          ...prev,
          firstname: doctorData.data.firstname || "",
          lastname: doctorData.data.lastname || "",
          email: doctorData.data.email || "",
          mobile: doctorData.data.mobile || "",
        }));
        console.log(formData);
        // Fetch dropdown options
        const fetchOption = async (endpoint) => {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/${endpoint}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint}`);
          }
          return response.json();
        };

        const [bloodGroupsRes, departmentsRes, designationsRes] =
          await Promise.all([
            fetchOption("blood-group-options"),
            fetchOption("department-options"),
            fetchOption("designation-options"),
          ]);

        setDropdownOptions({
          bloodGroups: bloodGroupsRes.data?.bloodGroups || [],
          departments: departmentsRes.data?.departments || [],
          designations: designationsRes.data?.designations || [],
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Rest of the component logic remains the same
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const staticRequestBody = {
        featureCode: "DOCTOR",
        operationType: "create",
        message: "",
        requestUrl: "/api/v1/user/doctor/create/request",
        requestId: null,
      };

      const requestBody = {
        ...staticRequestBody,
        data: JSON.stringify(formData),
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

      if (!response.ok) throw new Error("Failed to update profile");

      navigate("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-100 pt-24 p-4 sm:p-6 overflow-hidden">
      <div className="flex flex-col w-full bg-white shadow-md rounded-lg p-6 space-y-6 mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mt-4">
            Professional Information
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="text-xl space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <SelectField
              label="Blood Group"
              name="bloodGroup"
              value={formData.bloodGroup}
              options={dropdownOptions.bloodGroups}
              onChange={handleChange}
            />
            <InputField
              label="Registration No"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
            />
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
            <InputField
              type="date"
              label="Date of Birth"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          <div className="mt-5 p-5 border border-borderGray rounded-l shadow-md">
            <h3 className="text-lg font-bold mb-3">Add Time Slots</h3>
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="time"
                name="startTime"
                value={newTimeSlot.startTime}
                onChange={handleTimeSlotChange}
                className="flex-1 p-2 text-sm border border-borderGray rounded-md focus:border-ring-teal-500 focus:outline-none"
                placeholder="Start Time"
              />
              <input
                type="time"
                name="endTime"
                value={newTimeSlot.endTime}
                onChange={handleTimeSlotChange}
                className="flex-1 p-2 text-sm border border-borderGray rounded-md focus:border-ring-teal-500 focus:outline-none"
                placeholder="End Time"
              />
              <div className="flex gap-3 flex-wrap mt-2">
                {weekdays.map((day) => (
                  <label key={day} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={newTimeSlot.weekdays.includes(day)}
                      onChange={() => handleWeekdayToggle(day)}
                      className="accent-tealBlue"
                    />
                    {day}
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={addTimeSlot}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
              >
                Add Time Slot
              </button>
            </div>
            <div className="mt-4">
              {formData.timeSlots.map((slot, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 border border-borderGray rounded-md bg-background shadow-sm mb-2"
                >
                  <span>{`${slot.startTime} - ${
                    slot.endTime
                  } (${slot.weekdays.join(", ")})`}</span>
                  <button
                    type="button"
                    onClick={() => removeTimeSlot(index)}
                    className="px-3 py-1 text-white bg-secondaryButton text-sm rounded-md hover:bg-secondaryButtonHover transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-2/12 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition duration-300"
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

export default DoctorRegisterLevel2;
