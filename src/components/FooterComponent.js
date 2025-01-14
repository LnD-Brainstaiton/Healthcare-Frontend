import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-tealBlue text-white p-6 h-18 w-full fixed bottom-0 flex justify-center items-center">
        <span>All Right Reserved &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
};

export default Footer;
