import React from "react";
import { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Register from "./pages/Register";
import HeaderComponent from "./components/HeaderComponent";
import FooterComponent from "./components/FooterComponent";
import ProtectedRoute from "./components/ProtectedRoute"
import Login from "./components/LoginComponent"
import Logout from "./components/LogoutComponent"
import Sidebar from "./components/Sidebar"


function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Listen to token changes in localStorage (for example, when login/logout happens)
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    }, [token]); // Trigger this effect when the token state changes

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken); // Update the state when the user logs in
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null); // Update the state when the user logs out
    };
    return (
        <Router>  
            <HeaderComponent/>
            <div className="app">
                {token && <Sidebar />}{" "}
                <main>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route
                            path="/"
                            element={<Login onLogin={handleLogin} />} // Pass the login handler
                        />
                        <Route
                            path="/users"
                            element={
                            <ProtectedRoute>
                                {/* <Dashboard /> */}
                            </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/logout"
                            element={<Logout onLogout={handleLogout} />}
                        />{" "}
                    </Routes>
                </main>
            </div>
            <FooterComponent/>
        </Router>
    );
}

export default App;
