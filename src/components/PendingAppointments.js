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
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Pending Appointments List
      </h1>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by id..."
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
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Appointment No
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Appointment Date
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Appointment Time
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Patient Name
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Status</th>
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
                  <td className="py-3 px-4">{appointment.requestId}</td>
                  <td className="py-3 px-4">{appointment.appointmentDate}</td>
                  <td className="py-3 px-4">{appointment.appointmentTime}</td>
                  <td className="py-3 px-4">{appointment.patientName}</td>
                  <td className="py-3 px-4">{appointment.status}</td>
                  <td className="py-3 px-4">
                    <button
                      className="text-teal-600 hover:underline"
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
                <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
                  No pending appointment
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
              <strong>Appointment ID:</strong> {selectedAppointment.requestId}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Appointment ID:</strong> {selectedAppointment.doctorId}
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
              <strong>Patient Email:</strong> {selectedAppointment.patientEmail}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Patient Contact:</strong>{" "}
              {selectedAppointment.patientContactNo}
            </p>
            <p className="text-gray-600 mb-2">
              <strong>Appointment Reason:</strong> {selectedAppointment.reason}
            </p>
            <div className="flex justify-between">
              <button
                className="text-teal-600 hover:text-teal-800 transition duration-300 mr-2"
                onClick={() =>
                  handleAction(selectedAppointment.requestId, "Accepted")
                }
              >
                Approve
              </button>
              <button
                className="text-red-600 hover:text-red-800 transition duration-300"
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
