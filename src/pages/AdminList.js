import React, { useEffect, useState } from "react";
import "../styles/AdminList.css";

const AdminsList = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch("http://localhost:8000/api/v1/user/admin/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add Bearer token
          },
        });

        const data = await response.json();
        console.log(data);

        if (data.responseCode === "S100000") {
          setAdmins(data.data);
        } else {
          console.error("Error fetching admins:", data.responseMessage);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleUpdate = (admin) => {
    alert(`Update admin: ${admin.firstname} ${admin.lastname}`);
    // Add logic for updating the admin's details
  };

  const handleDelete = (adminId) => {
    alert(`Delete admin with ID: ${adminId}`);
    // Add logic for deleting the admin
  };

  return (
    <div className="admins-list">
      <h1>Admins List</h1>
      <table className="admins-table">
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
          {admins.length > 0 ? (
            admins.map((admin, index) => (
              <tr key={index}>
                <td>{admin.firstname}</td>
                <td>{admin.lastname}</td>
                <td>{admin.email}</td>
                <td>{admin.mobile}</td>
                <td>
                  <button
                    className="btn-update"
                    onClick={() => handleUpdate(admin)}
                  >
                    Update
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(admin.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No admins found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminsList;
