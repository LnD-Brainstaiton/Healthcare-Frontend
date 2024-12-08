import React, { useEffect, useState } from "react";
import "../styles/DoctorList.css";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch("http://localhost:8000/api/v1/user/doctor/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        });

        const data = await response.json();
        console.log(data);

        if (data.responseCode === "S100000") {
          setDoctors(data.data);
        } else {
          console.error("Error fetching doctors:", data.responseMessage);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleUpdate = (doctor) => {
    alert(`Update doctor: ${doctor.firstname} ${doctor.lastname}`);
    // Add logic for updating the doctor's details
  };

  const handleDelete = (doctorId) => {
    alert(`Delete doctor with ID: ${doctorId}`);
    // Add logic for deleting the doctor
  };

  return (
    <div className="doctors-list">
      <h1>Doctors List</h1>
      <table className="doctors-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctors.length > 0 ? (
            doctors.map((doctor, index) => (
              <tr key={index}>
                <td>{doctor.firstname}</td>
                <td>{doctor.lastname}</td>
                <td>{doctor.email}</td>
                <td>{doctor.mobile}</td>
                <td>
                  <button
                    className="btn-update"
                    onClick={() => handleUpdate(doctor)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(doctor.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No doctors found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DoctorsList;
