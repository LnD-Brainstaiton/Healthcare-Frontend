import React, { useEffect, useState } from "react";
import "../styles/PatientList.css";

const PatientsList = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch("http://localhost:8000/api/v1/user/patient/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        });

        const data = await response.json();
        console.log(data);

        if (data.responseCode === "S100000") {
          setPatients(data.data);
        } else {
          console.error("Error fetching patients:", data.responseMessage);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleUpdate = (patient) => {
    alert(`Update patient: ${patient.firstname} ${patient.lastname}`);
    // Add logic for updating the patient's details
  };

  const handleDelete = (patientId) => {
    alert(`Delete patient with ID: ${patientId}`);
    // Add logic for deleting the patient
  };

  return (
    <div className="patients-list">
      <h1>Patients List</h1>
      <table className="patients-table">
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
          {patients.length > 0 ? (
            patients.map((patient, index) => (
              <tr key={index}>
                <td>{patient.firstname}</td>
                <td>{patient.lastname}</td>
                <td>{patient.email}</td>
                <td>{patient.mobile}</td>
                <td>
                  <button
                    className="btn-update"
                    onClick={() => handleUpdate(patient)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(patient.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No patients found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsList;
