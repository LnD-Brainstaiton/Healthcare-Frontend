import React, { useEffect, useState } from "react";
import "../styles/PatientList.css";
import { useNavigate } from "react-router-dom";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");

  const [userType, setUserType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryId, setSearchQueryId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility state
  const pageSize = 10;

  // Fetch appointments data from the API
  const fetchAppointments = async (page = 0) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const getUserIdFromToken = () => {
        const token = localStorage.getItem("token"); // Replace with your token storage method
        if (!token) {
          throw new Error("No token found");
        }
        return localStorage.getItem("userId"); // Assuming the userId is stored separately
      };

      const userId = getUserIdFromToken();
      let queryParams = {
        page,
        size: pageSize,
        appointmentId: searchQueryId,
        date: searchDate, // Assuming the API accepts a "date" parameter
        time: searchTime, // Assuming the API accepts a "time" parameter
      };

      // Adjust queryParams based on userType
      if (userType === "doctor") {
        queryParams.doctorId = userId;
      } else if (userType === "patient") {
        queryParams.patientId = userId;
      }
      console.log("userType", userType);
      // Convert queryParams object to query string
      const queryString = new URLSearchParams(queryParams).toString();

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/appointment/list?${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.responseCode === "S100000") {
        setAppointments(data.data.data);
        setTotalPages(data.data.totalPages);
      } else {
        console.error("Error fetching appointments:", data.responseMessage);
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType.toLowerCase());
    }
  }, []);

  useEffect(() => {
    if (userType) {
      fetchAppointments(currentPage);
    }
  }, [userType, currentPage, searchQuery, searchQueryId]);

  const handleSearch = () => {
    setCurrentPage(0);
    fetchAppointments(0);
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment
    setIsPopupOpen(true); // Open the popup
  };

  const closePopup = () => {
    setSelectedAppointment(null); // Clear selected appointment
    setIsPopupOpen(false); // Close the popup
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
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen mt-24">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Appointments
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search by ID */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchQueryId}
              onChange={(e) => setSearchQueryId(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-60"
            />
          </div>

          {/* Start Date */}
          <div className="flex items-center space-x-2">
            <label className="text-gray-600 text-sm font-medium">
              Start Date:
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-40"
            />
          </div>

          {/* Start Time */}
          <div className="flex items-center space-x-2">
            <label className="text-gray-600 text-sm font-medium">
              Start Time:
            </label>
            <input
              type="time"
              value={searchTime}
              onChange={(e) => setSearchTime(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-40"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center space-x-2">
            <label className="text-gray-600 text-sm font-medium">
              End Date:
            </label>
            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-40"
            />
          </div>

          {/* End Time */}
          <div className="flex items-center space-x-2">
            <label className="text-gray-600 text-sm font-medium">
              End Time:
            </label>
            <input
              type="time"
              value={searchTime}
              onChange={(e) => setSearchTime(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-40"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
          >
            Search
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Appointment No
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Date</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Time</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Patient Name
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-4">{appointment.appointmentNo}</td>
                  <td className="py-3 px-4">{appointment.appointmentDate}</td>
                  <td className="py-3 px-4">{appointment.appointmentTime}</td>
                  <td className="py-3 px-4">{appointment.patientName}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleView(appointment)}
                      className="text-teal-600 hover:underline"
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
                        className="flex justify-center"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-3 px-4 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

      {isPopupOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Appointment Details
            </h2>
            <p className="text-gray-600 mb-2">
              <strong>Appointment No:</strong>{" "}
              {selectedAppointment.appointmentNo}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Appointment Date:</strong>{" "}
              {selectedAppointment.appointmentDate}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Appointment Time:</strong>{" "}
              {selectedAppointment.appointmentTime}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Patient Name:</strong> {selectedAppointment.patientName}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Patient Age:</strong> {selectedAppointment.patientAge}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Patient Contact:</strong>{" "}
              {selectedAppointment.patientContactNo}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Appointment Fee:</strong> {selectedAppointment.fee}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Appointment Reason:</strong> {selectedAppointment.reason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
