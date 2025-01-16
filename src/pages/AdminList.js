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
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/admin/all?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);


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
      <div className="max-w-screen-xl min-h-[81vh] mx-auto p-5 bg-white shadow-lg rounded-lg
    sm:max-w-screen-sm sm:px-4 sm:py-4
    md:max-w-screen-md md:px-6 md:py-6
    lg:max-w-screen-lg lg:px-8 lg:py-8
    xl:max-w-screen-xl xl:px-10 xl:py-10">
        <h1 className="text-center text-white bg-gradient-to-r from-teal-500 to-teal-700 p-6 rounded-lg shadow-lg text-3xl font-semibold mb-5">
          Admins List
        </h1>

        <div className={styles.searchFilterContainer}>
          <input
              type="text"
              placeholder="Search by id..."
              value={searchQueryId}
              onChange={(e) => setSearchQueryId(e.target.value)}
              className="px-2 py-2 text-lg w-48 border border-gray-300 rounded-md"
          />
          <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 py-2 text-lg w-48 border border-gray-300 rounded-md"
          />
          <button onClick={handleSearch}
                  className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors duration-300">
            Search
          </button>
        </div>

        <table className="w-full border-collapse my-5 text-sm text-left shadow-lg border border-gray-300">
          <thead className="bg-tealBlue text-white">
          <tr>
            <th className="px-4 py-3 text-center border border-borderGray">Id</th>
            <th className="px-4 py-3 text-center border border-borderGray">First Name</th>
            <th className="px-4 py-3 text-center border border-borderGray">Last Name</th>
            <th className="px-4 py-3 text-center border border-borderGray">Email</th>
            <th className="px-4 py-3 text-center border border-borderGray">Mobile</th>
            <th className="px-4 py-3 text-center border border-borderGray">Actions</th>
          </tr>
          </thead>
          <tbody>
          {admins.length > 0 ? (
              admins.map((admin, index) => (
                  <tr key={index} className="even:bg-backgroundHover hover:bg-backgroundHover">
                    <td className="px-4 py-3 border border-borderGray">{admin.adminId}</td>
                    <td className="px-4 py-3 border border-borderGray">{admin.firstname}</td>
                    <td className="px-4 py-3 border border-borderGray">{admin.lastname}</td>
                    <td className="px-4 py-3 border border-borderGray">{admin.email}</td>
                    <td className="px-4 py-3 border border-borderGray">{admin.mobile}</td>
                    <td className="px-4 py-3 border border-borderGray text-center">
                      <button
                          className="bg-primaryButton hover:bg-primaryButtonHover text-white py-1 px-3 rounded mr-2"
                          onClick={() => handleUpdate(admin.adminId)}
                      >
                        Update
                      </button>
                      <button
                          className="bg-secondaryButton hover:bg-secondaryButtonHover text-white py-1 px-3 rounded"
                          onClick={() => handleDelete(admin.adminId)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan="6" className="text-center text-secondaryText py-3">
                  No admins found.
                </td>
              </tr>
          )}
          </tbody>
        </table>

        <div className="flex justify-center items-center mt-5">
          <button
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              className="bg-blue-600 text-white border-none py-2 px-4 mx-2 cursor-pointer rounded-md text-base transition-colors duration-300 ease-in-out hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-lg mx-3">
        Page {currentPage + 1} of {totalPages}
    </span>
          <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className="bg-blue-600 text-white border-none py-2 px-4 mx-2 cursor-pointer rounded-md text-base transition-colors duration-300 ease-in-out hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
  );
};

export default AdminsList;
