import React from "react";
import HeroSection from "../components/HeroSection";
import FeaturedSection from "../components/FeaturedSection";
import TrailersSection from "../components/TrailersSection";
// import { useNavigate } from "react-router-dom";
const Home = () => {
  return (
    <div>
      <HeroSection />

      <FeaturedSection />
      <TrailersSection/>
        
    </div>
  );
};

export default Home;
