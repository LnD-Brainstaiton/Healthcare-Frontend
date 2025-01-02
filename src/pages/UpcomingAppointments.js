import React, { useEffect, useState } from "react";
import "../styles/PatientList.css";
import { useNavigate } from "react-router-dom";

const UpcomingAppointmentsList = () => {
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

      // Get the current date and time
    const now = new Date();
    const currentDate = now.toISOString().split("T")[0]; // Get the date in "YYYY-MM-DD" format
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`; // Get the time in "HH:mm" format
  
      const userId = getUserIdFromToken();
      let queryParams = {
        page,
        size: pageSize,
        appointmentId: searchQueryId,
        date: currentDate, // Assuming the API accepts a "date" parameter
        time: currentTime, // Assuming the API accepts a "time" parameter
      };
  
      // Adjust queryParams based on userType
      if (userType === "doctor") {
        queryParams.doctorId = userId;
      } else if (userType === "patient") {
        queryParams.patientId = userId;
      } 
      console.log("userType",userType);
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
    <div className="patients-list">
      <h1> Upcoming Appointments</h1>

      {/* <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by id..."
          value={searchQueryId}
          onChange={(e) => setSearchQueryId(e.target.value)}
          className="search-input"
        />
        <input
          type="date"
          placeholder="Search by date..."
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="search-input"
        />
        <input
          type="time" // This input type supports 24-hour format by default
          placeholder="Search by time..."
          value={searchTime}
          onChange={(e) => setSearchTime(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div> */}

      <table className="patients-table">
        <thead>
          <tr>
            <th>Appointment No</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
            <th>Patient Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <tr key={index}>
                <td>{appointment.appointmentNo}</td>
                <td>{appointment.appointmentDate}</td>
                <td>{appointment.appointmentTime}</td>
                <td>{appointment.patientName}</td>
                <td>
                  <button
                    className="view-icon-button"
                    onClick={() => handleView(appointment)}
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
                </td>


              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No appointments found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Next
        </button>
      </div>

      {isPopupOpen && selectedAppointment && (
  <div className="popup-overlay">
    <div className="popup-content">
      <button onClick={closePopup} className="popup-close-icon">×</button>
      <h2>Appointment Details</h2>
      <p><strong>Appointment No:</strong> {selectedAppointment.appointmentNo}</p>
      <p><strong>Appointment Date:</strong> {selectedAppointment.appointmentDate}</p>
      <p><strong>Appointment Time:</strong> {selectedAppointment.appointmentTime}</p>
      <p><strong>Patient Name:</strong> {selectedAppointment.patientName}</p>
      <p><strong>Patient Age:</strong> {selectedAppointment.patientAge}</p>
      <p><strong>Patient Contact:</strong> {selectedAppointment.patientContactNo}</p>
      <p><strong>Appointment Fee:</strong> {selectedAppointment.fee}</p>
      <p><strong>Appointment Reason:</strong> {selectedAppointment.reason}</p>
    </div>
  </div>
)}

    </div>
  );
};

export default UpcomingAppointmentsList;
