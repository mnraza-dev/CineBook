import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useResource } from "@/hooks/useResource";
import type { Movie } from "@/types";
import ResourceState from "./ResourceState";
import MovieCard from "./MovieCard";
import TitleSection from "./TitleSection";

const FeaturedSection = () => {
  const navigate = useNavigate();
  const state = useResource<Movie[]>("/movies");
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <TitleSection title="Now Showing in Cinemas" to="/movies" />
      <ResourceState {...state} retry={state.reload} />
      {!state.loading && !state.error && !state.data?.length && <p>No upcoming shows yet.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {state.data?.slice(0, 4).map((show) => (
          <MovieCard key={show._id} movie={show} />
        ))}
      </div>

      <div className="flex items-center justify-center mt-6">
        <Button
          onClick={() => {
            navigate("/movies");
            scrollTo(0, 0);
          }}
          className="login-gradient-diagonal hover:bg-[#f5ec9b] border-2 border-[#9d9974] hover:border-2 hover:border-[#f5ec9b] text-black px-6 py-1 text-sm  rounded-md flex items-center gap-2 hover:opacity-90 transition font-medium cursor-pointer"
        >
          See More
          {/* <ArrowRightCircle className="inline-block ml-2 w-4 h-4" />  */}
        </Button>
      </div>
    </div>
  );
};

export default FeaturedSection;
