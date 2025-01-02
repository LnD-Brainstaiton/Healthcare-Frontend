import React, { useEffect, useState } from "react";
import "../styles/PatientList.css";
import { useNavigate } from "react-router-dom";

const AppointmentReschedule = () => {
  const [appointments, setAppointments] = useState([]);
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

      const queryParams = new URLSearchParams({
        page,
        size: pageSize,
        firstnameLastname: searchQuery,
        id: searchQueryId,
      }).toString();

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/appointment/list?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);
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
    fetchAppointments(currentPage);
  }, [currentPage, searchQuery, searchQueryId]);

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
      <h1>Prescriptions</h1>
      <h1>Coming Soon</h1>

{/* 
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by id..."
          value={searchQueryId}
          onChange={(e) => setSearchQueryId(e.target.value)}
          className="search-input"
        />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <table className="patients-table">
        <thead>
          <tr>
            <th>Appointment No</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
            <th>Patient Name</th>
            <th>Patient Age</th>
            <th>Patient Contact</th>
            <th>Id</th>
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
                <td>{appointment.patientAge}</td>
                <td>{appointment.patientContactNo}</td>
                <td>{appointment.id}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => handleView(appointment)}
                  >
                    View
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
            <h2>Appointment Details</h2>
            <p><strong>Appointment No:</strong> {selectedAppointment.appointmentNo}</p>
            <p><strong>Appointment Date:</strong> {selectedAppointment.appointmentDate}</p>
            <p><strong>Appointment Time:</strong> {selectedAppointment.appointmentTime}</p>
            <p><strong>Patient Name:</strong> {selectedAppointment.patientName}</p>
            <p><strong>Patient Age:</strong> {selectedAppointment.patientAge}</p>
            <p><strong>Patient Contact:</strong> {selectedAppointment.patientContactNo}</p>
            <button onClick={closePopup} className="popup-close-button">Close</button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default AppointmentReschedule;
