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
    const userConfirmed = window.confirm(`Are you sure you want to delete the doctor with ID: ${patientId}?`);
  
    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");
  
        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }
  
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user/patient/${patientId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
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
    <div className="max-w-screen-xl min-h-[81vh] mx-auto p-5 bg-white shadow-lg rounded-lg
    sm:max-w-screen-sm sm:px-4 sm:py-4
    md:max-w-screen-md md:px-6 md:py-6
    lg:max-w-screen-lg lg:px-8 lg:py-8
    xl:max-w-screen-xl xl:px-10 xl:py-10">
      <h1 className="text-center text-white bg-gradient-to-r from-teal-500 to-teal-700 p-6 rounded-lg shadow-lg text-3xl font-semibold mb-5">
        Patients List
      </h1>

      <div
          className="flex flex-wrap gap-4 justify-start items-center mb-5 p-2.5 bg-gray-100 border border-gray-300 rounded-lg">
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

        <button
            onClick={handleSearch}
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors duration-300"
        >
          Search
        </button>
      </div>

      <table className="w-full border-collapse my-5 text-sm text-left">
        <thead className="bg-tealBlue text-white">
        <tr>
          <th className="px-4 py-3 text-center border border-borderGray">Id</th>
          <th className="px-4 py-3 text-center border border-borderGray">First Name</th>
          <th className="px-4 py-3 text-center border border-borderGray">Last Name</th>
          <th className="px-4 py-3 text-center border border-borderGray">Email</th>
          <th className="px-4 py-3 text-center border border-borderGray">Mobile</th>
          <th className="px-4 py-3 text-center border border-borderGray">Blood Group</th>
          <th className="px-4 py-3 text-center border border-borderGray">Age</th>
          <th className="px-4 py-3 text-center border border-borderGray">Actions</th>
        </tr>
        </thead>
        <tbody>
        {patients.length > 0 ? (
            patients.map((patient, index) => (
                <tr key={index} className="even:bg-backgroundHover hover:bg-backgroundHover">
                  <td className="px-4 py-3 border border-borderGray">{patient.patientId}</td>
                  <td className="px-4 py-3 border border-borderGray">{patient.firstname}</td>
                  <td className="px-4 py-3 border border-borderGray">{patient.lastname}</td>
                  <td className="px-4 py-3 border border-borderGray">{patient.email}</td>
                  <td className="px-4 py-3 border border-borderGray">{patient.mobile}</td>
                  <td className="px-4 py-3 border border-borderGray">{patient.bloodGroup}</td>
                  <td className="px-4 py-3 border border-borderGray">{patient.age}</td>
                  <td className="px-4 py-3 border border-borderGray text-center">
                    <button
                        className="bg-primaryButton hover:bg-primaryButtonHover text-white py-1 px-3 rounded mr-2"
                        onClick={() => handleUpdate(patient.patientId)}
                    >
                      Update
                    </button>
                    <button
                        className="bg-secondaryButton hover:bg-secondaryButtonHover text-white py-1 px-3 rounded"
                        onClick={() => handleDelete(patient.patientId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
            ))
        ) : (
            <tr>
              <td colSpan="8" className="text-center text-secondaryText py-3">No patients found.</td>
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

export default PatientsList;
