import React from "react";
import UI_IMG from "../../assets/images/auth-img.png";
import NavbarAuth from "./NavbarAuth";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      {/* Navbar */}
      <NavbarAuth />

      {/* Main Content */}
      <div className="flex flex-1 h-screen">
        <div className="w-full md:w-[60vw] bg-gray-50 px-12 pt-8 pb-12 mt-16 flex items-center justify-center">
          <div className="w-full max-w-4xl">{children}</div>
        </div>
        <div className="hidden md:flex w-[40vw] h-full items-center justify-center bg-blue-50">
          <img src={UI_IMG} alt="Auth" className="object-cover h-full w-full" />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
