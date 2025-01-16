import React, {useEffect, useState} from "react";
import "../styles/DoctorList.css";
import {useNavigate} from "react-router-dom"; // Import useNavigate


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
                fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user/designation-options`, {headers}),
                fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user/department-options`, {headers}),
                fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user/gender-options`, {headers}),
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
    }

    const handleDelete = async (doctorId) => {
        const userConfirmed = window.confirm(`Are you sure you want to delete the doctor with ID: ${doctorId}?`);

        if (userConfirmed) {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    alert("Authentication token not found. Please log in.");
                    return;
                }

                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/v1/user/doctor/${doctorId}`, {
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
        <div className="max-w-screen-xl min-h-[81vh] mx-auto p-5 bg-white shadow-lg rounded-lg
    sm:max-w-screen-sm sm:px-4 sm:py-4
    md:max-w-screen-md md:px-6 md:py-6
    lg:max-w-screen-lg lg:px-8 lg:py-8
    xl:max-w-screen-xl xl:px-10 xl:py-10">
            <h1 className="flex items-center justify-between text-white bg-gradient-to-r from-teal-500 to-teal-700 p-6 rounded-lg shadow-lg text-3xl font-semibold mb-5">
                <span>Doctors List</span>
                <button
                    onClick={handleCreateDoctor}
                    className="px-5 py-2 bg-tealBlue text-white rounded-md cursor-pointer text-lg hover:bg-tealBlueHover">
                    Create Doctor
                </button>
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
                <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-48 px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                    className="w-48 px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
                    className="w-48 px-4 py-2 mt-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                    <option value="">Select Gender</option>
                    {genderOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
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
                    <th className="px-4 py-3 text-center border border-borderGray">Designation</th>
                    <th className="px-4 py-3 text-center border border-borderGray">Department</th>
                    <th className="px-4 py-3 text-center border border-borderGray">Fee</th>
                    <th className="px-4 py-3 text-center border border-borderGray">Actions</th>
                </tr>
                </thead>
                <tbody>
                {doctors.length > 0 ? (
                    doctors.map((doctor, index) => (
                        <tr key={index} className="even:bg-backgroundHover hover:bg-backgroundHover">
                            <td className="px-4 py-3 border border-borderGray">{doctor.doctorId}</td>
                            <td className="px-4 py-3 border border-borderGray">{doctor.firstname}</td>
                            <td className="px-4 py-3 border border-borderGray">{doctor.lastname}</td>
                            <td className="px-4 py-3 border border-borderGray">{doctor.designation}</td>
                            <td className="px-4 py-3 border border-borderGray">{doctor.department}</td>
                            <td className="px-4 py-3 border border-borderGray">{doctor.fee}</td>
                            <td className="px-4 py-3 border border-borderGray text-center">
                                <button
                                    className="bg-primaryButton hover:bg-primaryButtonHover text-white py-1 px-3 rounded mr-2"
                                    onClick={() => handleUpdate(doctor.doctorId)}
                                >
                                    Update
                                </button>
                                <button
                                    className="bg-secondaryButton hover:bg-secondaryButtonHover text-white py-1 px-3 rounded"
                                    onClick={() => handleDelete(doctor.doctorId)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center text-secondaryText py-3">No doctors found.</td>
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

export default DoctorsList;
