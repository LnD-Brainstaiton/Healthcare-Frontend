import React from "react";
import profilePicture from "../assets/doctor-1.jpg";

const DoctorView = () => {
  return (
    <div className="flex bg-red-400 w-full h-full">
      <div className="flex flex-col w-full h-80 items-center justify-center bg-green-400">
        <img src={profilePicture} className="w-64 h-64 rounded-full" />
        <div className="mt-4 text-lg font-semibold text-white">⭐ 4.5/5</div>
        <div></div>
      </div>
    </div>
  );
};

export default DoctorView;
