import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo.jpeg";
import logoRounded from "../assets/logo-rounded.png";

const Header = ({ toggleSidebar }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  return (
    <header className="bg-tealBlue text-white text-xl p-2 h-18 w-full fixed lg:relative z-50">
      <div className="flex justify-between items-center h-full">
        <div className="flex justify-between items-center">
          {token && (
            <button
              className="flex flex-col justify-between items-center ml-8 w-8 h-6 focus:outline-none scale-75"
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
            <Link
              to="/logout"
              className="inline-flex items-center px-4 py-2 rounded-md hover:bg-teal-500 transition-colors duration-200"
            >
              <span>Sign out</span>
            </Link>
          ) : (
            <div className="space-x-2">
              <Link
                to="/login"
                className="px-2 py-2 rounded-md hover:bg-teal-500 transition-colors duration-200"
              >
                Sign in
              </Link>
              {/* <span className="text-teal-200">or</span> */}
              <Link
                to="/register"
                className="px-2 py-2 rounded-md hover:bg-teal-500 transition-colors duration-200"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
