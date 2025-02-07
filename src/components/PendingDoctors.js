import React, { useEffect, useState } from "react";
import "../styles/DoctorList.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { testImage } from "../assets/Logo.jpeg";

const DoctorsApproveList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [searchQueryId, setSearchQueryId] = useState("");
  const [designationOptions, setDesignationOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [error, setError] = useState(null);
  const [captchaImage, setCaptchaImage] = useState(null);
  // const [response, setResponse] = useState(null);
  const [captchaCode, setCaptchaCode] = useState(""); // State for CAPTCHA code
  const [registrationNo, setRegistrationNo] = useState(""); // State for registration number
  const [htmlContent, setHtmlContent] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility state
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Popup state
  const [isUpdatePopupOpen, setIsUpdatePopupOpen] = useState(false); // For update popup visibility
  const [updateFormData, setUpdateFormData] = useState({
    requestId: "",
    status: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    designation: "", // Added for doctor
    department: "", // Added for doctor
    specialities: "", // Added for doctor
    fee: "", // Added for doctor
  });
  const pageSize = 10;

  const validateRegistration = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/validate/registration`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            captchaCode: captchaCode, // Use CAPTCHA code from state
            registrationNo: registrationNo, // Use registration number from state
          }),
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();
      setHtmlContent(data.data);
      fetchCaptcha();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCaptcha = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/get/captcha`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to load CAPTCHA");
      }

      const data = await response.json();

      if (data && data.data) {
        // Assuming the backend sends Base64 data like "data:image/png;base64,iVBOR..."
        setCaptchaImage("data:image/png;base64," + data.data);
      } else {
        console.error("Invalid CAPTCHA response");
      }
    } catch (error) {
      console.error("Error fetching CAPTCHA:", error);
    }
  };

  // Fetch doctors data from the API
  const fetchDoctors = async (page = 0) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const queryParams = new URLSearchParams({
        page,
        size: pageSize,
        requestId: searchQueryId,
        featureCode: "DOCTOR",
        checkerResponse: "3",
      }).toString();

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/admin/tempdata?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      const doctorsData = data.data.content.map((item) => ({
        ...JSON.parse(JSON.parse(item.data)), // Parse the data and spread it to include all the fields
        requestId: item.requestId, // Add the requestId from the original item
        status: item.status,
      }));

      if (data.responseCode === "S100000") {
        setDoctors(doctorsData);
        console.log(doctorsData);
        setTotalPages(data.data.totalPages);
      } else {
        console.error("Error fetching doctors:", data.responseMessage);
        setDoctors([]); // Clear table if an error occurs
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]); // Clear table if an error occurs
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

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setUpdateFormData({
  //     ...updateFormData,
  //     [name]: value,
  //   });
  // };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUpdateFormData({
      ...updateFormData,
      [name]: value,
    });
  };

  const handleUpdate = (doctor) => {
    setSelectedDoctor(doctor); // Set the doctor for update
    setUpdateFormData({
      requestId: doctor.requestId,
      firstname: doctor.firstname,
      lastname: doctor.lastname,
      email: doctor.email,
      mobile: doctor.mobile,
      patientId: doctor.patientId,
      designation: doctor.designation || "",
      department: doctor.department || "",
      specialities: doctor.specialities || "",
      fee: doctor.fee || "",
      status: "Pending",
    }); // Pre-fill the update form with doctor's data
    setIsUpdatePopupOpen(true); // Open the update popup
  };

  const handleRefreshCaptcha = () => {
    fetchCaptcha(); // Fetch a new CAPTCHA on button click
  };

  const closeUpdatePopup = () => {
    setSelectedDoctor(null); // Clear the selected doctor
    setIsUpdatePopupOpen(false); // Close the update popup
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const requestBody = {
        featureCode: "DOCTOR",
        operationType: "update",
        message: "",
        requestUrl: "/api/v1/user/admin/temp/request",
        requestId: selectedDoctor.requestId,
        data: JSON.stringify(updateFormData),
      };

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/admin/temp/request`,
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
        alert("Doctor updated successfully!");
        closeUpdatePopup(); // Close popup on success
        fetchDoctors(currentPage); // Refresh the list
      } else {
        alert(`Failed to update doctor: ${data.responseMessage}`);
      }
    } catch (error) {
      console.error("Error updating doctor:", error);
      alert("An error occurred while updating the doctor.");
    }
  };

  // Fetch doctors data when filters or pagination change
  useEffect(() => {
    fetchDropdownOptions();
    fetchDoctors(currentPage); // Fetch initial data
  }, []);

  useEffect(() => {
    fetchDoctors(currentPage); // Refetch when the page changes
  }, [currentPage]);

  useEffect(() => {
    fetchDoctors(0); // Refetch when filters change
  }, [searchQueryId]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset pagination
    fetchDoctors(0); // Refetch with new filters
  };

  const handleView = (appointment) => {
    setSelectedDoctor(appointment); // Set the selected appointment
    setIsPopupOpen(true); // Open the popup
    fetchCaptcha(); // Fetch CAPTCHA image
  };

  const closePopup = () => {
    setSelectedDoctor(null); // Clear selected appointment
    setIsPopupOpen(false); // Close the popup
    setHtmlContent("");
    setCaptchaCode("");
    setRegistrationNo("");
  };

  const handleCheck = async (doctor, status) => {
    let confirmation = "reject";
    if (status == "Accepted") confirmation = "accept";
    let userConfirmed = window.confirm(
      `Are you sure you want to ${confirmation} the doctor with ID: ${doctor.userId}?`
    );

    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }

        const requestBody = {
          userId: doctor.userId,
          registrationNo: doctor.registrationNo,
          designation: doctor.designation,
          department: doctor.department,
          specialities: doctor.specialities,
          timeSlots: doctor.timeSlots,
          bloodGroup: doctor.bloodGroup,
          dob: doctor.dob,
          fee: doctor.fee,
        };
        console.log(requestBody);
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/create/request`,
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
          alert(`Doctor ${status} successfully!`);
          closePopup();
          fetchDoctors(currentPage); // Refresh the list after deletion
        } else {
          alert(`Failed to ${confirmation} doctor: ${data.responseMessage}`);
        }
      } catch (error) {
        console.error("Error processing doctor:", error);
        alert("An error occurred while trying to process the doctor.");
      }
    } else {
      alert("Process canceled.");
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      {/** Page title */}
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Pending Doctors
      </h1>
      {/* Search form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchQueryId}
              onChange={(e) => setSearchQueryId(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-60"
            />
          </div>

          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
          >
            Search
          </button>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-gray-700 font-semibold">Id</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                First Name
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Last Name
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Designation
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Department
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Status</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? (
              doctors.map((doctor, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-4">{doctor.userId}</td>
                  <td className="py-3 px-4">{doctor.firstname}</td>
                  <td className="py-3 px-4">{doctor.lastname}</td>
                  <td className="py-3 px-4">{doctor.designation}</td>
                  <td className="py-3 px-4">{doctor.department}</td>
                  <td className="py-3 px-4">{doctor.status}</td>
                  <td className="py-3 px-4">
                    <button
                      className="text-teal-600 hover:underline"
                      onClick={() => handleView(doctor)}
                      title="View Details"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-eye"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                    {/* {doctor.status === "Rejected" && (
                      <button
                        className="text-teal-600 hover:text-teal-800 transition duration-300 mr-2"
                        onClick={() => handleUpdate(doctor)}
                        title="Update Details"
                      >
                        Update
                      </button>
                    )} */}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
                  No pending doctor
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      {/* Popup */}
      {/* {isUpdatePopupOpen && selectedDoctor && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button onClick={closeUpdatePopup} className="popup-close-icon">
              ×
            </button>

            <form onSubmit={handleUpdateSubmit}>
              <label>First Name</label>
              <input
                type="text"
                name="firstname"
                value={updateFormData.firstname || ""}
                onChange={handleChange}
              />

              <label>Last Name</label>
              <input
                type="text"
                name="lastname"
                value={updateFormData.lastname || ""}
                onChange={handleChange}
              />

              <label>Email</label>
              <input
                type="email"
                name="email"
                value={updateFormData.email || ""}
                onChange={handleChange}
              />

              <label>Mobile</label>
              <input
                type="text"
                name="mobile"
                value={updateFormData.mobile || ""}
                onChange={handleChange}
              />

              <label>Designation</label>
              <select
                name="designation"
                value={updateFormData.designation}
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

              <label>Department</label>
              <select
                name="department"
                value={updateFormData.department}
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

              <label>Fee</label>
              <input
                type="number"
                name="fee"
                value={updateFormData.fee || ""}
                onChange={handleChange}
              />

              <label htmlFor="specialities">Specialities</label>
              <input
                name="specialities"
                value={updateFormData.specialities || ""}
                onChange={handleChange}
              />
              <div className="update-footer">
                <button type="submit" className="update-submit">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )} */}
      {/* Doctor details popup */}
      {isPopupOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-xl">
          <div className="relative bg-white rounded-lg shadow-lg w-2/3 p-6 max-h-[80vh] overflow-y-auto">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 mx-4 text-gray-800">
              Doctor Details
            </h2>
            <div className="w-full space-y-4">
              <ProfileField label="Request ID" value={selectedDoctor.userId} />
              <ProfileField
                label="Registration No"
                value={selectedDoctor.registrationNo}
              />
              <ProfileField
                label="First Name"
                value={selectedDoctor.firstname}
              />
              <ProfileField label="Last Name" value={selectedDoctor.lastname} />
              <ProfileField label="Email" value={selectedDoctor.email} />
              <ProfileField label="Mobile" value={selectedDoctor.mobile} />
              <ProfileField
                label="Designation"
                value={selectedDoctor.designation}
              />
              <ProfileField
                label="Department"
                value={selectedDoctor.department}
              />
              <ProfileField label="Fee" value={selectedDoctor.fee} />
              <ProfileField
                label="Specialities"
                value={selectedDoctor.specialities}
              />
              <ProfileField label="Status" value={selectedDoctor.status} />
            </div>
            {/** Time slot */}
            <div className="m-4">
              <strong>Time Slot:</strong>
              {selectedDoctor.timeSlots &&
              selectedDoctor.timeSlots.length > 0 ? (
                selectedDoctor.timeSlots.map((slot, index) => (
                  <div key={index} style={{ marginBottom: "10px" }}>
                    <div>
                      Start Time: {slot.startTime}, End Time: {slot.endTime},
                      Weekdays:{" "}
                      {slot.weekdays && slot.weekdays.length > 0 ? (
                        slot.weekdays.map((day, idx) => (
                          <span key={idx} style={{ marginRight: "5px" }}>
                            {day}
                          </span>
                        ))
                      ) : (
                        <span>None</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div>No time slots available.</div>
              )}
            </div>
            <div className="scale-95 w-auto h-auto outline-double outline-tealBlue ">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
            <div className="m-4 my-8">
              {/* CAPTCHA and Registration Number Input Fields */}
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  CAPTCHA Code
                </label>
                <input
                  type="text"
                  value={captchaCode}
                  onChange={(e) => setCaptchaCode(e.target.value)}
                  className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-2/3"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  value={registrationNo}
                  onChange={(e) => setRegistrationNo(e.target.value)}
                  className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-2/3"
                />
              </div>
              <div className="mt-4">
                <button
                  onClick={validateRegistration}
                  className="px-4 py-2 bg-tealBlue text-white font-semibold rounded-lg shadow-md hover:bg-tealBlueHover transition-all duration-200"
                >
                  Validate
                </button>
              </div>
            </div>
            {/* Captcha Image */}
            <div className="flex flex-col items-center m-4  rounded-lg  w-fit">
              {captchaImage && (
                <img
                  src={captchaImage}
                  alt="CAPTCHA"
                  className="w-48 h-auto my-4 border rounded-lg shadow-sm"
                />
              )}
              <button
                onClick={handleRefreshCaptcha}
                className="px-4 py-2 bg-tealBlue text-white font-semibold rounded-lg shadow-md hover:bg-tealBlueHover transition-all duration-200"
              >
                Refresh CAPTCHA
              </button>
            </div>

            <div className="popup-actions p-4">
              <button
                className="text-red-600 hover:text-red-800 transition duration-300"
                onClick={() => handleCheck(selectedDoctor, "Rejected")}
              >
                Reject
              </button>
              <button
                className="text-teal-600 hover:text-teal-800 transition duration-300 mr-2"
                onClick={() => handleCheck(selectedDoctor, "Accepted")}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const ProfileField = ({ label, value }) => (
  <div className="text-xl px-4">
    <div className="flex justify-start">
      <span className="text-gray-600 w-2/6">{label}:</span>
      <span className="text-gray-800">{value || "N/A"}</span>
    </div>
    <hr className="my-4" />
  </div>
);
export default DoctorsApproveList;
