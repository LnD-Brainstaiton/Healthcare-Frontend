import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-tealBlue text-white p-4 h-18 w-full flex justify-center items-center mt-auto">
        <span>All Right Reserved &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default Footer;
