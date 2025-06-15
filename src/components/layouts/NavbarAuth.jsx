import React from "react";
import { Link } from "react-router-dom";

const NavbarAuth = () => {
  return (
    <nav className="fixed top-0 z-50 w-full px-14 py-4 flex justify-between items-center bg-white border-b border-gray-200">
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-5 h-5 bg-gradient-to-b from-blue-500 to-green-400 rounded-full"></div>
        <span className="text-sm font-semibold">Logo</span>
      </Link>
      <div className="space-x-4">
        <Link to="/login" className="text-sm px-4 py-1 border border-gray-300 rounded hover:bg-gray-100">
          Log In
        </Link>
        <Link to="/signup" className="text-sm px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default NavbarAuth;
