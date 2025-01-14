import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo.jpeg";

const Header = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  return (
    <header className="bg-tealBlue text-white text-xl p-6 h-18 w-full">
      <div className="flex justify-between items-center h-full">
        <img src={logo} className="h-12 rounded-full border-2" alt="logo" />
        <nav>
          {token ? (
            <Link to="/">Login</Link>
          ) : location.pathname === "/register" ? (
            <Link to="/">Login</Link>
          ) : (
            <Link to="/register">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
