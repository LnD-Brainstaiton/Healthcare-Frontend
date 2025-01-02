import React, { useEffect, useState } from "react";
import "../styles/DoctorList.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const DoctorsApproveList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [searchQueryId, setSearchQueryId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility state
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Popup state
  
  const pageSize = 10;

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
      console.log(data);
      const doctorsData = data.data.content.map(item => ({
        ...JSON.parse(JSON.parse(item.data)), // Parse the data and spread it to include all the fields
        requestId: item.requestId, // Add the requestId from the original item
        status: item.status,
      }));
      console.log("Fetched doctors data:", doctorsData); // Debug API response

      if (data.responseCode === "S100000") {
        setDoctors(doctorsData);
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

  

  // Fetch doctors data when filters or pagination change
  useEffect(() => {
    // fetchDropdownOptions(); // Fetch dropdown options once
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
  };

  const closePopup = () => {
    setSelectedDoctor(null); // Clear selected appointment
    setIsPopupOpen(false); // Close the popup
  };

  const handleCheck = async (requestId, status) => {
    let confirmation = "reject";
    if(status == "Accepted")
      confirmation = "accept"
    let userConfirmed = window.confirm(`Are you sure you want to ${confirmation} the doctor with ID: ${requestId}?`);
  
    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }

        const requestBody = {
          featureCode: "DOCTOR", // Replace with your actual feature code
          status: status, // Replace with your actual operation type
          message: "", // Replace with your actual message
          requestId: requestId, // Replace with your actual request ID
        };
        
       
  
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user/admin/request/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });
  
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
    <div className="doctors-list">
      <h1>Pending Doctors List</h1>

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
          <th>Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.requestId}</td>
                <td>{doctor.firstName}</td>
                <td>{doctor.lastName}</td>
                <td>{doctor.designation}</td>
                <td>{doctor.department}</td>
                <td>{doctor.status}</td>
                <td>
                <button
                    className="view-icon-button"
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
                  
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No doctors found.</td>
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

      {isPopupOpen && selectedDoctor && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button onClick={closePopup} className="popup-close-icon">×</button>
            <h2>Doctor Details</h2>
            <p><strong>Request ID:</strong> {selectedDoctor.requestId}</p>
            <p><strong>First Name:</strong> {selectedDoctor.firstName}</p>
            <p><strong>Last Name:</strong> {selectedDoctor.lastName}</p>
            <p><strong>Email:</strong> {selectedDoctor.email}</p>
            <p><strong>Mobile:</strong> {selectedDoctor.mobile}</p>
            <p><strong>Designation:</strong> {selectedDoctor.designation}</p>
            <p><strong>Department:</strong> {selectedDoctor.department}</p>
            <p><strong>Fee :</strong> {selectedDoctor.fee}</p>
            <p><strong>Speacialities :</strong> {selectedDoctor.specialities}</p>
            <p><strong>Status:</strong> {selectedDoctor.status}</p>

            <div className="popup-actions">
              <button
                className="btn-approve"
                onClick={() => handleCheck(selectedDoctor.requestId,"Accepted")}
              >
                Approve
              </button>
              <button
                className="btn-reject"
                onClick={() => handleCheck(selectedDoctor.requestId,"Rejected")}
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

export default DoctorsApproveList;
