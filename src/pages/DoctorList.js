import React, { useEffect, useState } from "react";
import "../styles/DoctorList.css";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [specialities, setSpecialities] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
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
        firstnameLastname: searchQuery,
        designation,
        department,
        specialities,
      }).toString();

      const response = await fetch(
        `http://localhost:8000/api/v1/user/doctor/all?${queryParams}`,
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
        setDoctors(data.data.data);
        setTotalPages(data.data.totalPages);
      } else {
        console.error("Error fetching doctors:", data.responseMessage);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Fetch data when the current page changes
  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  // Trigger search when the Search button is clicked
  const handleSearch = () => {
    setCurrentPage(0); // Reset to the first page on a new search
    fetchDoctors(0);
  };

  // Handle doctor update action
  const handleUpdate = (doctor) => {
    alert(`Update doctor: ${doctor.firstname} ${doctor.lastname}`);
  };

  // Handle doctor delete action
  const handleDelete = (doctorId) => {
    alert(`Delete doctor with ID: ${doctorId}`);
  };

  // Pagination controls
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
      <h1>Doctors List</h1>

      {/* Search and Filter Section */}
      <div className="search-filter-container">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Select Designation</option>
          <option value="Consultant">Consultant</option>
          <option value="Specialist">Specialist</option>
          <option value="Surgeon">Surgeon</option>
        </select>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Select Department</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedics">Orthopedics</option>
        </select>
        <select
          value={specialities}
          onChange={(e) => setSpecialities(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Select Specialities</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Geriatrics">Geriatrics</option>
          <option value="Oncology">Oncology</option>
        </select>
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {/* Doctors Table */}
      <table className="doctors-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.firstname}</td>
                <td>{doctor.lastname}</td>
                <td>{doctor.email}</td>
                <td>{doctor.mobile}</td>
                <td>
                  <button
                    className="btn-update"
                    onClick={() => handleUpdate(doctor)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(doctor.id)}
                  >
                    Delete
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

      {/* Pagination Controls */}
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
    </div>
  );
};

export default DoctorsList;
