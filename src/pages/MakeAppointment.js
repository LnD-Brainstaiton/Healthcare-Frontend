import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/MakeAppointment.module.css";

const MakeAppointment = () => {
    const { doctorId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const doctorInfo = location.state?.doctorInfo;

    const [formData, setFormData] = useState({
        patientFirstName: "",
        patientLastName: "",
        patientEmail: "",
        patientMobile: "",
        doctorId: doctorId,
        doctorFirstName: doctorInfo?.firstname || "",
        doctorLastName: doctorInfo?.lastname || "",
        designation: doctorInfo?.designation || "",
        department: doctorInfo?.department || "",
        specialities: doctorInfo?.specialities || "",
        fee: doctorInfo?.fee || "",
        appointmentDate: "",
        appointmentTime: "",
        reason: "",
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const appointmentData = {
                doctorId: formData.doctorId,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                reason: formData.reason,
                patientInfo: {
                    firstName: formData.patientFirstName,
                    lastName: formData.patientLastName,
                    email: formData.patientEmail,
                    mobile: formData.patientMobile,
                },
            };

            const response = await fetch(
                "http://localhost:8000/api/v1/appointments/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(appointmentData),
                }
            );

            const data = await response.json();

            if (data.responseCode === "S100000") {
                setSuccess("Appointment booked successfully!");
                setTimeout(() => {
                    navigate("/appointments");
                }, 2000);
            } else {
                setError(data.responseMessage || "Failed to book appointment");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={styles.appointmentContainer}>
            <div className={styles.appointmentCard}>
                <h2 className={styles.appointmentHeader}>Book Appointment</h2>
                <form className={styles.appointmentForm} onSubmit={handleSubmit}>
                    <div className={styles.formColumns}>
                        <div className={styles.formColumn}>
                            <div className={styles.sectionHeader}>Doctor Information</div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>Doctor Name:</label>
                                <input
                                    type="text"
                                    value={`${formData.doctorFirstName} ${formData.doctorLastName}`}
                                    className={styles.inputField}
                                    disabled
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>Designation:</label>
                                <input
                                    type="text"
                                    value={formData.designation}
                                    className={styles.inputField}
                                    disabled
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>Department:</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    className={styles.inputField}
                                    disabled
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>Fee:</label>
                                <input
                                    type="text"
                                    value={formData.fee}
                                    className={styles.inputField}
                                    disabled
                                />
                            </div>

                            <div className={styles.sectionHeader}>Appointment Details</div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>Date:</label>
                                <input
                                    type="date"
                                    name="appointmentDate"
                                    value={formData.appointmentDate}
                                    onChange={handleChange}
                                    className={styles.inputField}
                                    required
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>Time:</label>
                                <input
                                    type="time"
                                    name="appointmentTime"
                                    value={formData.appointmentTime}
                                    onChange={handleChange}
                                    className={styles.inputField}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.formColumn}>
                            <div className={styles.sectionHeader}>Patient Information</div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>First Name:</label>
                                <input
                                    type="text"
                                    name="patientFirstName"
                                    value={formData.patientFirstName}
                                    onChange={handleChange}
                                    className={styles.inputField}
                                    required
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>Last Name:</label>
                                <input
                                    type="text"
                                    name="patientLastName"
                                    value={formData.patientLastName}
                                    onChange={handleChange}
                                    className={styles.inputField}
                                    required
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>Email:</label>
                                <input
                                    type="email"
                                    name="patientEmail"
                                    value={formData.patientEmail}
                                    onChange={handleChange}
                                    className={styles.inputField}
                                    required
                                />
                            </div>
                            <div className={styles.formField}>
                                <label className={styles.fieldLabel}>Mobile:</label>
                                <input
                                    type="text"
                                    name="patientMobile"
                                    value={formData.patientMobile}
                                    onChange={handleChange}
                                    className={styles.inputField}
                                    required
                                />
                            </div>

                            <div className={styles.sectionHeader}>Reason for Visit</div>
                            <div className={styles.formField}>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className={styles.inputField}
                                    required
                                    rows="5"
                                    placeholder="Please describe your reason for visit..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.formFooter}>
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        {success && <p className={styles.successMessage}>{success}</p>}
                        <button type="submit" className={styles.submitButton}>
                            Book Appointment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MakeAppointment;
