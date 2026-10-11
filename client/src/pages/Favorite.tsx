import MovieCard from "../components/MovieCard";
import TitleSection from "../components/TitleSection";
import { dummyShowsData } from "../assets/assets";
import BlurCircle from "../components/BlurCircle";
const Favorite = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <BlurCircle bottom="0px" right="50px" />
      {dummyShowsData.length > 0 && <TitleSection title="Your Favorite Movies" />}
      <BlurCircle top="150px" left="0" />
      {dummyShowsData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {dummyShowsData.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-screen flex-col">
          <h1 className="text-3xl font-bold text-center">
            No Movies Available
          </h1>
        </div>
      )}
    </div>
  );
};

export default Favorite;
