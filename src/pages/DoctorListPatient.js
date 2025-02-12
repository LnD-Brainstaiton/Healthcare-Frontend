import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dp from "../assets/Logo.jpeg";
import pd from "../assets/doctor-1.jpg";
import { Search, ChevronDown } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Healthcare Specialist
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with top medical professionals and book your appointment today
        </p>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            {/* Designation Dropdown */}
            <div className="relative">
              <select
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full h-12 pl-4 pr-10 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select Designation</option>
                {designationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Department Dropdown */}
            <div className="relative">
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full h-12 pl-4 pr-10 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">Select Department</option>
                {departmentOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="h-12 px-8 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition duration-200"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="relative">
                  <img
                    src={
                      doctor.image ||
                      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
                    }
                    className="w-full h-48 object-cover"
                    alt={`${doctor.firstname} ${doctor.lastname}`}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h2 className="text-white font-semibold text-lg">
                      Dr. {doctor.firstname} {doctor.lastname}
                    </h2>
                    <p className="text-white/90 text-sm">
                      {doctor.designation}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-gray-600">{doctor.department}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Available for consultations
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => viewDoctor(doctor.doctorId)}
                      className="flex-1 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition duration-200"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => makeAppointment(doctor)}
                      className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No doctors found matching your criteria.
              </p>
              <p className="text-gray-400 mt-2">
                Try adjusting your search filters.
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {doctors.length > 0 && (
          <div className="flex justify-center items-center mt-12 space-x-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              Previous
            </button>
            <span className="text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPages - 1 ? prev + 1 : prev
                )
              }
              disabled={currentPage === totalPages - 1}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default DoctorListPatient;
