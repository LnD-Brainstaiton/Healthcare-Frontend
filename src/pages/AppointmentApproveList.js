import React, { useEffect, useState } from "react";
import "../styles/DoctorList.css";
import { useNavigate } from "react-router-dom";

const AppointmentsApproveList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
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
        requestId: searchQueryId,
        featureCode: "APPOINTMENT",
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
      const appointmentsData = data.data.content.map((item) => ({
        ...JSON.parse(JSON.parse(item.data)),
        requestId: item.requestId,
        status: item.status,
      }));
      console.log(appointmentsData);

      if (data.responseCode === "S100000") {
        setAppointments(appointmentsData);
        setTotalPages(data.data.totalPages);
      } else {
        console.error("Error fetching appointments:", data.responseMessage);
        setAppointments([]); // Clear table if an error occurs
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]); // Clear table if an error occurs
    }
  };

  useEffect(() => {
    fetchAppointments(currentPage);
  }, []);

  useEffect(() => {
    fetchAppointments(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchAppointments(0);
  }, [searchQueryId]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset pagination
    fetchAppointments(0); // Refetch with new filters
  };

  const handleAction = async (requestId, status) => {
    let confirmation = "reject";
    if (status == "Accepted") confirmation = "accept";
    let userConfirmed = window.confirm(
      `Are you sure you want to ${confirmation} the appointment with ID: ${requestId}?`
    );

    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }

        const requestBody = {
          featureCode: "APPOINTMENT", // Replace with your actual feature code
          status: status, // Replace with your actual operation type
          message: "", // Replace with your actual message
          requestId: requestId, // Replace with your actual request ID
        };

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/admin/request/check`,
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
          alert(`Appointment ${status} successfully!`);
          closePopup();
          fetchAppointments(currentPage); // Refresh the list after deletion
        } else {
          alert(
            `Failed to ${confirmation} appointment: ${data.responseMessage}`
          );
        }
      } catch (error) {
        console.error("Error processing appointment:", error);
        alert("An error occurred while trying to process the appointment.");
      }
    } else {
      alert("Process canceled.");
    }
  };

  const closePopup = () => {
    setSelectedAppointment(null); // Clear selected appointment
    setIsPopupOpen(false); // Close the popup
  };

  const handleView = (appointment) => {
    setSelectedAppointment(appointment); // Set the selected appointment
    setIsPopupOpen(true); // Open the popup
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
    <div className="doctors-list">
      <h1>Pending Appointments List</h1>

      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by id..."
          value={searchQueryId}
          onChange={(e) => setSearchQueryId(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      <table className="doctors-table">
        <thead>
          <tr>
            <th>Appointment No</th>
            <th>Appointment Date</th>
            <th>Appointment Time</th>
            <th>Patient Name</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <tr key={index}>
                <td>{appointment.requestId}</td>
                <td>{appointment.appointmentDate}</td>
                <td>{appointment.appointmentTime}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.status}</td>
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
              <td colSpan="5">No appointments found.</td>
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
            <button onClick={closePopup} className="popup-close-icon">
              ×
            </button>
            <h2>Appointment Details</h2>
            <p>
              <strong>Appointment ID:</strong> {selectedAppointment.requestId}
            </p>
            <p>
              <strong>Appointment ID:</strong> {selectedAppointment.doctorId}
            </p>
            <p>
              <strong>Appointment Date:</strong>{" "}
              {selectedAppointment.appointmentDate}
            </p>
            <p>
              <strong>Appointment Time:</strong>{" "}
              {selectedAppointment.appointmentTime}
            </p>
            <p>
              <strong>Patient Name:</strong> {selectedAppointment.patientName}
            </p>
            <p>
              <strong>Patient Email:</strong> {selectedAppointment.patientEmail}
            </p>
            <p>
              <strong>Patient Contact:</strong>{" "}
              {selectedAppointment.patientContactNo}
            </p>
            <p>
              <strong>Appointment Reason:</strong> {selectedAppointment.reason}
            </p>
            <div className="popup-actions">
              <button
                className="btn-approve"
                onClick={() =>
                  handleAction(selectedAppointment.requestId, "Accepted")
                }
              >
                Approve
              </button>
              <button
                className="btn-reject"
                onClick={() =>
                  handleAction(selectedAppointment.requestId, "Rejected")
                }
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsApproveList;
