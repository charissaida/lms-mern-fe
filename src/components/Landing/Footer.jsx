import React from "react";
import { FaFacebook, FaGithub, FaGoogle, FaCodepen, FaMicrosoft } from "react-icons/fa";

const Footer = () => {
  return (
    <footer id="kontak" className="bg-[#1A253F] text-white py-10">
      <div className="max-w-6xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="md:mr-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-green-400 rounded-full" />
            <span className="font-semibold text-lg">Logo</span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
        </div>

        {/* Right Side */}
        <div className="md:ml-20">
          <h3 className="text-white font-semibold mb-2">Contact Us</h3>
          <ul className="text-gray-300 text-sm space-y-1 mb-4">
            <li>Alamat: 123 Main Street, Anytown, ID 12345</li>
            <li>Tel: (+62) 81234567890</li>
            <li>Mail: someone@gmail.com</li>
          </ul>
          <div className="flex gap-4 text-white text-xl">
            <FaFacebook className="hover:text-blue-400 transition" />
            <FaGithub className="hover:text-gray-400 transition" />
            <FaGoogle className="hover:text-red-400 transition" />
            <FaCodepen className="hover:text-white transition" />
            <FaMicrosoft className="hover:text-blue-500 transition" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
