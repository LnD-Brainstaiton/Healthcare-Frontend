import React, { useEffect, useState } from "react";
import "../styles/DoctorList.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { testImage } from "../assets/Logo.jpeg";
import { Eye, Search, X, RefreshCw } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Pending Doctors
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Review and approve doctor registration requests
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search by ID..."
                value={searchQueryId}
                onChange={(e) => setSearchQueryId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              onClick={handleSearch}
              className="w-full sm:w-auto px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Doctors List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.length > 0 ? (
                  doctors.map((doctor, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.userId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {doctor.firstname} {doctor.lastname}
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doctor.designation}
                      </td>
                      <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doctor.department}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          {doctor.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleView(doctor)}
                          className="text-teal-600 hover:text-teal-900 focus:outline-none"
                          title="View Details"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No pending doctors found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages - 1}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage + 1}</span>{" "}
                    of <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 0}
                      className="relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages - 1}
                      className="relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Details Modal */}
      {isPopupOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Doctor Details
              </h2>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Doctor Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileField
                  label="Request ID"
                  value={selectedDoctor.userId}
                />
                <ProfileField
                  label="Registration No"
                  value={selectedDoctor.registrationNo}
                />
                <ProfileField
                  label="Name"
                  value={`${selectedDoctor.firstname} ${selectedDoctor.lastname}`}
                />
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

              {/* Time Slots */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">Time Slots</h3>
                {selectedDoctor.timeSlots &&
                selectedDoctor.timeSlots.length > 0 ? (
                  selectedDoctor.timeSlots.map((slot, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-600">
                        {slot.startTime} - {slot.endTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        {slot.weekdays.join(", ")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No time slots available
                  </p>
                )}
              </div>
              <div className="scale-95 w-auto h-auto  ">
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </div>
              {/* Validation Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CAPTCHA Code
                    </label>
                    <input
                      type="text"
                      value={captchaCode}
                      onChange={(e) => setCaptchaCode(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Captcha Image */}
                <div className="flex items-center gap-4">
                  <img
                    src={captchaImage}
                    alt="CAPTCHA"
                    className="h-12 rounded border"
                  />
                  <button
                    onClick={handleRefreshCaptcha}
                    className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>

                <button
                  onClick={validateRegistration}
                  className="w-full sm:w-auto px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
                >
                  Validate Registration
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-end gap-4 border-t border-gray-200">
              <button
                onClick={() => handleCheck(selectedDoctor, "Rejected")}
                className="px-4 py-2 border border-red-600 text-red-600 font-medium rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => handleCheck(selectedDoctor, "Accepted")}
                className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors"
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
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900">{value || "N/A"}</dd>
  </div>
);
export default DoctorsApproveList;
