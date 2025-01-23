import React, { useEffect, useState } from "react";
import "../styles/PatientList.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AppointmentReapproveList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryId, setSearchQueryId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Fetch patients data from the API
  const fetchPatients = async (page = 0) => {
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
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/patient/all?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Fetched patients data:", data); // Debug API response

      if (data.responseCode === "S100000") {
        setPatients(data.data.data);
        setTotalPages(data.data.totalPages);
      } else {
        console.error("Error fetching patients:", data.responseMessage);
        setPatients([]); // Clear table if an error occurs
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]); // Clear table if an error occurs
    }
  };

  // Fetch patients data when filters or pagination change
  useEffect(() => {
    fetchPatients(currentPage); // Fetch initial data
  }, []);

  useEffect(() => {
    fetchPatients(currentPage); // Refetch when the page changes
  }, [currentPage]);

  useEffect(() => {
    fetchPatients(0); // Refetch when filters change
  }, [searchQuery, searchQueryId]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset pagination
    fetchPatients(0); // Refetch with new filters
  };

  const handleUpdate = (userId) => {
    navigate(`/update-profile/${userId}/patient`);
  };

  const handleDelete = async (patientId) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the doctor with ID: ${patientId}?`
    );

    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/patient/${patientId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.responseCode === "S100000") {
          alert("Doctor deleted successfully!");
          fetchPatients(currentPage); // Refresh the list after deletion
        } else {
          alert(`Failed to delete doctor: ${data.responseMessage}`);
        }
      } catch (error) {
        console.error("Error deleting doctor:", error);
        alert("An error occurred while trying to delete the doctor.");
      }
    } else {
      alert("Delete action canceled.");
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
    <div className="patients-list">
      {/* <h1>Appointment Reschedule Approve</h1>
      <h1>Coming Soon</h1> */}
    </div>
  );
};

export default AppointmentReapproveList;
