// src/pages/InstructionPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/InstructionPage.module.css";

const InstructionPage = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.instructionContainer}>
            <div className={styles.instructionCard}>
                <h2 className={styles.header}>Payment Required</h2>
                <p className={styles.message}>
                    Your appointment has been booked successfully. Please complete the payment to confirm your appointment.
                </p>
                <button
                    className={styles.payButton}
                    onClick={() => navigate("/payment")}
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};

export default InstructionPage;
