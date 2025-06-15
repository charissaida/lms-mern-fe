import React from "react";
import NavbarLandingPage from "../components/Landing/NavbarLandingPage";
import Hero from "../components/Landing/Hero";
import About from "../components/Landing/About";
import Features from "../components/Landing/Features";
import HowTo from "../components/Landing/HowTo";
import Testimonials from "../components/Landing/Testimonials";
import Footer from "../components/Landing/Footer";

const LandingPage = () => {
  return (
    <>
      <NavbarLandingPage />
      <Hero />
      <About />
      <Features />
      <HowTo />
      <Testimonials />
      <Footer />
    </>
  );
};

export default LandingPage;
