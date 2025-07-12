import React from "react";
import { assets } from "../assets/assets";
import { ArrowRight, Calendar1Icon, ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className=' flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36  bg-[url("/backgroundImage.png")] bg-cover bg-center h-screen'>
      <img src={assets.marvelLogo} alt="" className="max-h-11 lg:h-11 mt-20" />
      <h1 className=" text-5xl md:text-[70px] md:leading-16 font-semibold max-w-110">
        Guardians <br /> of the Galaxy
      </h1>
      <div className="flex items-center gap-4 text-gray-300 ">
        <span>Action | Adventure | Sci-Fi</span>
        <div className="flex items-center gap-1">
          <Calendar1Icon color="#f5ec9b" className=" w-4.5 h-4.5  " /> 2018
        </div>
        <div className="flex items-center gap-1">
          <ClockIcon color="#f5ec9b" className=" w-4.5 h-4.5  " /> 2h 16m
        </div>
      </div>
      <p className="text-gray-300 max-w-md">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, quidem
        voluptatum. Doloribus, cumque. Quisquam, doloribus. Natus, quidem
        voluptatum. Doloribus, cumque. Quisquam, doloribus. Natus, quidem
        voluptatum. Doloribus, cumque. Quisquam, doloribus.
      </p>
      <button
        onClick={() => navigate("/movies")}
        className="login-gradient-radial hover:bg-[#f5ec9b] border-2 border-[#9d9974] hover:border-2 hover:border-[#f5ec9b] text-black px-6 py-2 text-sm  rounded-full flex items-center gap-2 hover:opacity-90 transition font-medium cursor-pointer"
      >
        Explore Movies
        <ArrowRight className="inline-block ml-2 w-4 h-4" />
      </button>
    </div>
  );
};

export default HeroSection;
