import React, { useEffect, useState } from "react";
import "../styles/DoctorList.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const DoctorsApproveList = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryId, setSearchQueryId] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [genderOptions, setGenderOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
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
        id: searchQueryId,
        firstnameLastname: searchQuery,
        designation,
        department,
        gender,
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
      console.log("Fetched doctors data:", data); // Debug API response

      if (data.responseCode === "S100000") {
        setDoctors(data.data.data);
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

  // Fetch dropdown options for designation, department, and gender
  const fetchDropdownOptions = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [designationRes, departmentRes, genderRes] = await Promise.all([
        fetch("http://localhost:8000/api/v1/user/designation-options", { headers }),
        fetch("http://localhost:8000/api/v1/user/department-options", { headers }),
        fetch("http://localhost:8000/api/v1/user/gender-options", { headers }),
      ]);

      const designationData = await designationRes.json();
      const departmentData = await departmentRes.json();
      const genderData = await genderRes.json();

      console.log(genderData);

      setDesignationOptions(designationData.data.designations || []);
      setDepartmentOptions(departmentData.data.departments || []);
      setGenderOptions(genderData.data.gender || []);
    } catch (error) {
      console.error("Error fetching dropdown options:", error);
    }
  };

  // Fetch doctors data when filters or pagination change
  useEffect(() => {
    fetchDropdownOptions(); // Fetch dropdown options once
    fetchDoctors(currentPage); // Fetch initial data
  }, []);

  useEffect(() => {
    fetchDoctors(currentPage); // Refetch when the page changes
  }, [currentPage]);

  useEffect(() => {
    fetchDoctors(0); // Refetch when filters change
  }, [searchQueryId, searchQuery, designation, department, gender]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset pagination
    fetchDoctors(0); // Refetch with new filters
  };

  const handleUpdate = (userId) => {
    navigate(`/update-profile/${userId}/doctor`);
  };

  const handleDelete = async (doctorId) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete the doctor with ID: ${doctorId}?`);
  
    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }
  
        const response = await fetch(`http://localhost:8000/api/v1/user/doctor/${doctorId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
  
        if (data.responseCode === "S100000") {
          alert("Doctor deleted successfully!");
          fetchDoctors(currentPage); // Refresh the list after deletion
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
    <div className="doctors-list">
      <h1>Doctors List</h1>

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
        <select
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Select Designation</option>
          {designationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Select Department</option>
          {departmentOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Select Gender</option>
          {genderOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
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
            <th>Fee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.doctorId}</td>
                <td>{doctor.firstname}</td>
                <td>{doctor.lastname}</td>
                <td>{doctor.designation}</td>
                <td>{doctor.department}</td>
                <td>{doctor.fee}</td>
                <td>
                  <button
                    className="btn-update"
                    onClick={() => handleUpdate(doctor.doctorId)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(doctor.doctorId)}
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

export default DoctorsApproveList;
