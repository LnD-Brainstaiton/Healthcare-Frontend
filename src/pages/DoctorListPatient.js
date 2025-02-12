import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dp from "../assets/Logo.jpeg";
import pd from "../assets/doctor-1.jpg";

const DoctorListPatient = () => {
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
  const pageSize = 12;

  // Fetching logic (same as the original)

  const fetchDoctors = async (page = 0) => {
    try {


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
          },
        }
      );

      const data = await response.json();
      console.log(data);
      if (data.responseCode === "S100000") {
        setDoctors(data.data.data);
        setTotalPages(data.data.totalPages);
      } else {
        setDoctors([]);
      }
    } catch {
      setDoctors([]);
    }
  };

  const fetchDropdownOptions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

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

      setDesignationOptions(designationData.data.designations || []);
      setDepartmentOptions(departmentData.data.departments || []);
      setGenderOptions(genderData.data.gender || []);
    } catch {}
  };

  useEffect(() => {
    fetchDropdownOptions();
    fetchDoctors(0);
  }, []);

  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchDoctors(0);
  }, [searchQueryId, searchQuery, designation, department, gender]);

  const handleSearch = () => {
    setCurrentPage(0);
    fetchDoctors(0);
  };

  const makeAppointment = (doctor) => {
    navigate(`/make-appointment/${doctor.doctorId}`, {
      state: { doctorInfo: doctor },
    });
  };

  const viewDoctor = (doctorId, patientId) => {
    navigate(`/doctor-profile/${doctorId}/${patientId}`);
  };

  return (
    <div className="flex flex-col px-6 py-8 space-y-6">
      <h1 className="text-center text-4xl font-bold text-gray-800">
        Find Your Doctor
      </h1>

      <div className="w-full  rounded-lg p-4 flex flex-wrap items-center gap-4 ">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-tealBlue focus:border-primaryText"
          />
        </div>

        {/* Designation Dropdown */}
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

        {/* Department Dropdown */}
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

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex-shrink-0 h-12 px-6 py-2 bg-tealBlue text-white font-semibold rounded-lg shadow-md hover:bg-opacity-90"
        >
          Search
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {doctors.length > 0 ? (
          doctors.map((doctor, index) => (
            <div
              key={index}
              className="flex flex-col justify-around p-4 border border-gray-300 rounded-lg shadow-md bg-white transition-transform transform hover:-translate-y-2"
            >
              <div className="flex-grow">
                <img
                  src={pd}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                  alt="doctor"
                  onClick={() => viewDoctor(doctor.doctorId)}
                />
                <h2
                  className="text-lg font-semibold text-gray-800"
                  onClick={() => viewDoctor(doctor.doctorId)}
                >
                  {doctor.firstname} {doctor.lastname}
                </h2>
                <p className="text-gray-600">{doctor.designation}</p>
                <p className="text-gray-500 text-sm">{doctor.department}</p>
              </div>
              <div className="">
                <button
                  onClick={() => makeAppointment(doctor)}
                  className="mt-4 w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No doctors found.
          </div>
        )}
      </div>

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev))
          }
          disabled={currentPage === totalPages - 1}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DoctorListPatient;
