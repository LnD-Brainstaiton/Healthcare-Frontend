import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo.jpeg";

const Header = ({ toggleSidebar }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  return (
    <header className="bg-tealBlue text-white text-xl p-2 h-18 w-full">
      <div className="flex justify-between items-center h-full">
        <div className="flex justify-between items-center">
          {token && (
            <button
              className="flex flex-col justify-between items-center w-8 h-6 focus:outline-none"
              onClick={toggleSidebar}
            >
              <div className="h-1 w-full bg-white"></div>
              <div className="h-1 w-full bg-white"></div>
              <div className="h-1 w-full bg-white"></div>
            </button>
          )}

          <img
            src={logo}
            className="h-12 rounded-lg ml-6 scale-75"
            alt="logo"
          />
          <h1 className="text-2xl">Health Care</h1>
        </div>
        <nav>
          {token ? (
            <Link to="/logout">Sign out</Link>
          ) : location.pathname === "/register" ? (
            <Link to="/">Sign in</Link>
          ) : (
            <Link to="/register">Sign up</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
