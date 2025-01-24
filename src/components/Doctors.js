import React, { useEffect, useState } from "react";
import "../styles/DoctorList.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const DoctorsList = () => {
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
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/all?${queryParams}`,
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
        fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/designation-options`,
          { headers }
        ),
        fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/department-options`,
          { headers }
        ),
        fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/gender-options`,
          { headers }
        ),
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

  const handleCreateDoctor = () => {
    setCurrentPage(0); // Reset pagination
    navigate("/create-doctor");
  };

  const handleDelete = async (doctorId) => {
    const userConfirmed = window.confirm(
      `Are you sure you want to delete the doctor with ID: ${doctorId}?`
    );

    if (userConfirmed) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Authentication token not found. Please log in.");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/${doctorId}`,
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
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <h1 className="flex justify-between items-center text-3xl font-semibold text-gray-800 mb-6">
        <span>Doctors</span>
        <button
          onClick={handleCreateDoctor}
          className=" bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
        >
          Create Doctor
        </button>
      </h1>
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
          <div className="relative flex-1">
            <select
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full h-12 pl-3 pr-8 py-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-tealBlue focus:border-primaryText"
            >
              <option value="">Select Designation</option>
              {designationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex-1">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full h-12 pl-3 pr-8 py-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-tealBlue focus:border-primaryText"
            >
              <option value="">Select Department</option>
              {departmentOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="relative flex-1">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full h-12 pl-3 pr-8 py-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-tealBlue focus:border-primaryText"
            >
              <option value="">Select Gender</option>
              {genderOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
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
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Designation
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">
                Department
              </th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Fee</th>
              <th className="py-3 px-4 text-gray-700 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.length > 0 ? (
              doctors.map((doctor, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="py-3 px-4">{doctor.doctorId}</td>
                  <td className="py-3 px-4">{doctor.firstname}</td>
                  <td className="py-3 px-4">{doctor.lastname}</td>
                  <td className="py-3 px-4">{doctor.designation}</td>
                  <td className="py-3 px-4">{doctor.department}</td>
                  <td className="py-3 px-4">{doctor.fee}</td>
                  <td className="py-3 px-4">
                    <button
                      className="text-teal-600 hover:text-teal-800 transition duration-300 mr-2"
                      onClick={() => handleUpdate(doctor.doctorId)}
                    >
                      Update
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition duration-300"
                      onClick={() => handleDelete(doctor.doctorId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-3 px-4 text-center text-gray-500">
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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

export default DoctorsList;
