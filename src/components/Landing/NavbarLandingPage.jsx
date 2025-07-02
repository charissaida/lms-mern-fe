import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function NavbarLandingPage() {
  return (
    <nav className="fixed top-0 z-50 w-full px-14 py-4 flex justify-between items-center bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-6" />
        <span className="text-sm font-semibold">EduPlant Metrics</span>
      </div>
      <ul className="hidden md:flex space-x-6 text-sm text-gray-700 font-medium">
        <li>
          <a href="#tentang">Tentang</a>
        </li>
        <li>
          <a href="#fitur">Fitur</a>
        </li>
        <li>
          <a href="#petunjuk">Petunjuk</a>
        </li>
        <li>
          <a href="#kontak">Kontak</a>
        </li>
      </ul>
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
}

export default NavbarLandingPage;
