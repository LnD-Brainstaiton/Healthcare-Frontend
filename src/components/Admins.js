import React, { useEffect, useState } from "react";
import styles from "../styles/AdminsList.module.css";
import { useNavigate } from "react-router-dom";

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
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/admin/all?${queryParams}`,
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
        setAdmins([]);
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
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the admin with ID: ${adminId}?`
    );

    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/admin/${adminId}`,
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
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admins</h1>

      {/* Search Filter Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by ID..."
              value={searchQueryId}
              onChange={(e) => setSearchQueryId(e.target.value)}
              className="border rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 w-60"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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

      {/* Admins Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-gray-700 font-semibold">ID</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                First Name
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Last Name
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Email</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Mobile</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length > 0 ? (
              admins.map((admin) => (
                <tr
                  key={admin.adminId}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-4">{admin.adminId}</td>
                  <td className="py-3 px-4">{admin.firstname}</td>
                  <td className="py-3 px-4">{admin.lastname}</td>
                  <td className="py-3 px-4">{admin.email}</td>
                  <td className="py-3 px-4">{admin.mobile}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleUpdate(admin.adminId)}
                      className="text-teal-600 hover:text-teal-800 transition duration-300 mr-2"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(admin.adminId)}
                      className="text-red-600 hover:text-red-800 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
                  No admins found
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
    </div>
  );
};

export default AdminsList;
