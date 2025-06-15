import React from "react";
import imageAbout from "../../assets/images/teacher.png";

function About() {
  return (
    <section id="tentang" className="bg-gray-50 py-16 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="h-full overflow-hidden">
            <img src={imageAbout} alt="Tentang Kami" className="w-[70%] mx-auto md:mx-0 md:w-full md:h-full object-cover" />
          </div>
        </div>

        {/* Text */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Tentang Kami</h2>
          <p className="text-sm text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p className="text-sm text-gray-600">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
          <button className="mt-4 px-5 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-900 transition cursor-pointer">Kenali Fitur Kami →</button>
        </div>
      </div>
    </section>
  );
}

export default About;
