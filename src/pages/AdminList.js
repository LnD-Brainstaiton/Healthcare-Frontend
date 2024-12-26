import React, { useEffect, useState } from "react";
import styles from "../styles/AdminsList.module.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const AdminsList = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryId, setSearchQueryId] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

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
      if (data.responseCode === "S100000") {
        setAdmins(data.data.data);
        setTotalPages(data.data.totalPages);
      } else {
        console.error("Error fetching admins:", data.responseMessage);
        setAdmins([]); // Clear table if an error occurs
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      setAdmins([]);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage, searchQuery, searchQueryId]);

  const handleSearch = () => {
    setCurrentPage(0);
    fetchAdmins(0);
  };

  const handleUpdate = (userId) => {
    navigate(`/update-profile/${userId}/admin`);
  };

  const handleDelete = async (adminId) => {
    const userConfirmed = window.confirm(`Are you sure you want to delete the admin with ID: ${adminId}?`);

    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }

        const response = await fetch(
          `http://localhost:8000/api/v1/user/admin/${adminId}`,
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
          alert("Admin deleted successfully!");
          fetchAdmins(currentPage);
        } else {
          alert(`Failed to delete admin: ${data.responseMessage}`);
        }
      } catch (error) {
        console.error("Error deleting admin:", error);
        alert("An error occurred while trying to delete the admin.");
      }
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
    <div className={styles.adminsList}>
      <h1>Admins List</h1>

      <div className={styles.searchFilterContainer}>
        <input
          type="text"
          placeholder="Search by id..."
          value={searchQueryId}
          onChange={(e) => setSearchQueryId(e.target.value)}
          className={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.searchButton}>
          Search
        </button>
      </div>

      <table className={styles.adminsTable}>
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
                    className={styles.btnUpdate}
                    onClick={() => handleUpdate(admin.adminId)}
                  >
                    Update
                  </button>
                  <button
                    className={styles.btnDelete}
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

      <div className={styles.paginationControls}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 0}
          className={styles.paginationButton}
        >
          Previous
        </button>
        <span className={styles.paginationInfo}>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages - 1}
          className={styles.paginationButton}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminsList;
