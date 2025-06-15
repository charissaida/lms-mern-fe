import React from "react";

const steps = [
  {
    number: "1",
    title: "Login",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. .",
  },
  {
    number: "2",
    title: "Akses Materi & kerjakan Soal",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. .",
  },
  {
    number: "3",
    title: "Ikuti Studi Kasus & Diskusi",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. .",
  },
  {
    number: "4",
    title: "Berikan Testimoni",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. .",
  },
  {
    number: "5",
    title: "Simpan Hasil di E-Portofolio",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. .",
  },
];

const HowTo = () => {
  return (
    <section id="petunjuk" className="py-20 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-16">Petunjuk Penggunaan</h2>
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center lg:items-start gap-6`}>
              {/* Step content */}
              <div className="bg-white flex rounded-xl gap-4 shadow-md p-6 w-full max-w-3xl">
                <div className="w-40 h-10 md:w-28 md:h-16 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center text-xl">{step.number}</div>
                <div>
                  <h4 className="text-blue-600 font-semibold text-base">{step.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowTo;
