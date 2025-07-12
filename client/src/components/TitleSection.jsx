import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TitleSection = ({ title, buttonText = "", to = "/movies" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
    scrollTo(0, 0);
  };

  return (
    <div className="flex items-center justify-between mb-8 mt-6">
      <p className="text-logo-gradient text-3xl font-semibold">{title}</p>
      {buttonText && (
        <button
        onClick={handleClick}
        className="login-gradient-diagonal hover:bg-[#f5ec9b] border-2 border-[#9d9974] hover:border-[#f5ec9b] text-black px-6 py-2 text-sm rounded-full flex items-center gap-2 hover:opacity-90 transition font-medium cursor-pointer"
      >
        {buttonText}
        <ArrowRight className="inline-block ml-2 w-4 h-4" />
      </button>
      )}
    </div>
  );
};

export default TitleSection;
