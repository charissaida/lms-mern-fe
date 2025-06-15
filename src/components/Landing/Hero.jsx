import React from "react";
import imageHero from "../../assets/images/students.png";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="bg-white">
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-16 max-w-6xl mx-auto gap-10">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Belajar Terstruktur <br /> Evaluasi Terukur
          </h1>
          <p className="text-gray-600 text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
            cillum dolore eu fugiat nulla pariatur.
          </p>
          <Link to="/login" className="px-5 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition cursor-pointer">
            Mulai Belajar
          </Link>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-center mb-10 md:mb-0">
          <div className="w-[80%] overflow-hidden">
            <img src={imageHero} alt="Student" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default Hero;
