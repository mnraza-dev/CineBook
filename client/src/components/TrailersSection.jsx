import React, { useState } from "react";
import { dummyTrailers } from "../assets/assets";
import ReactPlayer from "react-player";
import BlurCircle from "./BlurCircle";
import TitleSection from "./TitleSection";

const TrailersSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[1]);

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden py-20">
      <TitleSection title="Trailers" buttonText="See All" to="/trailers" />
      <div className="relative mt-6">
        <BlurCircle top="-100px" right="-20px" />

          <ReactPlayer
            url={currentTrailer.videoUrl}
      
            controls={false}
 
            className=" mx-auto max-w-full"
            width="960px"
            height="540px"
          />
        
      </div>
    </div>
  );
};

export default TrailersSection;
