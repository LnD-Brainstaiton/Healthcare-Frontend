import React, { useEffect, useState } from "react";
import "../styles/AdminList.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate


const AdminsList = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryId, setSearchQueryId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // Fetch admins data from the API
  const fetchAdmins = async (page = 0) => {
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
        `http://localhost:8000/api/v1/user/admin/all?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Fetched admins data:", data); // Debug API response

      if (data.responseCode === "S100000") {
        setAdmins(data.data.data);
        setTotalPages(data.data.totalPages);
      } else {
        console.error("Error fetching admins:", data.responseMessage);
        setAdmins([]); // Clear table if an error occurs
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]); // Clear table if an error occurs
    }
  };

  

  // Fetch admins data when filters or pagination change
  useEffect(() => {
    fetchAdmins(currentPage); // Fetch initial data
  }, []);

  useEffect(() => {
    fetchAdmins(currentPage); // Refetch when the page changes
  }, [currentPage]);

  useEffect(() => {
    fetchAdmins(0); // Refetch when filters change
  }, [searchQuery, searchQueryId]);

  const handleSearch = () => {
    setCurrentPage(0); // Reset pagination
    fetchAdmins(0); // Refetch with new filters
  };

  const handleUpdate = (userId) => {
    navigate(`/update-profile/${userId}/admin`);
  };

  const handleDelete = async (adminId) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete the doctor with ID: ${adminId}?`);
  
    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }
  
        const response = await fetch(`http://localhost:8000/api/v1/user/admin/${adminId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
  
        if (data.responseCode === "S100000") {
          alert("Doctor deleted successfully!");
          fetchAdmins(currentPage); // Refresh the list after deletion
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
    <div className="admins-list">
      <h1>Admins List</h1>

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

      <table className="admins-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.length > 0 ? (
            admins.map((admin, index) => (
              <tr key={index}>
                <td>{admin.adminId}</td>
                <td>{admin.firstname}</td>
                <td>{admin.lastname}</td>
                <td>{admin.email}</td>
                <td>{admin.mobile}</td>
                <td>
                  <button
                    className="btn-update"
                    onClick={() => handleUpdate(admin.adminId)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(admin.adminId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No admins found.</td>
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

export default AdminsList;
