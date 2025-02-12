import React, { useEffect, useState } from "react";
import "../styles/PatientList.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PatientsList = () => {
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
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen mt-24">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Patients</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by id..."
              value={searchQueryId}
              onChange={(e) => setSearchQueryId(e.target.value)}
              className="px-2 py-2 text-lg w-48 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 py-2 text-lg w-48 border border-gray-300 rounded-md"
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
              <th className="py-3 px-4 text-gray-700 font-semibold">Id</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                First Name
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Last Name
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Email</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Mobile</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Blood Group
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Age</th>
              {/* <th className="py-3 px-4 text-gray-700 font-semibold">Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {patients.length > 0 ? (
              patients.map((patient, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-4">{patient.patientId}</td>
                  <td className="py-3 px-4">{patient.firstname}</td>
                  <td className="py-3 px-4">{patient.lastname}</td>
                  <td className="py-3 px-4">{patient.email}</td>
                  <td className="py-3 px-4">{patient.mobile}</td>
                  <td className="py-3 px-4">{patient.bloodGroup}</td>
                  <td className="py-3 px-4">{patient.age}</td>
                  {/* <td className="py-3 px-4">
                    <button
                      className="text-teal-600 hover:text-teal-800 transition duration-300 mr-2"
                      onClick={() => handleUpdate(patient.patientId)}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition duration-300"
                      onClick={() => handleDelete(patient.patientId)}
                    >
                      Delete
                    </button>
                  </td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-3 px-4 text-center text-gray-500">
                  No patients found
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

export default PatientsList;
