import { ArrowRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const FeaturedSection = () => {
  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="flex items-center justify-between mb-8 mt-6">
        <p className="text-logo-gradient text-3xl font-semibold">Now Showing</p>
        <button
          onClick={() => navigate("/movies")}
          className="login-gradient-radial hover:bg-[#f5ec9b] border-2 border-[#9d9974] hover:border-2 hover:border-[#f5ec9b] text-black px-6 py-2 text-sm  rounded-full flex items-center gap-2 hover:opacity-90 transition font-medium cursor-pointer"
        >
          View All
          <ArrowRight className="inline-block ml-2 w-4 h-4" />
        </button>
      </div>
      <div></div>

      <div></div>
    </div>
  );
};

export default FeaturedSection;
