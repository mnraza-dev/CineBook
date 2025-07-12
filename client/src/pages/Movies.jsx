import MovieCard from "../components/MovieCard";
import TitleSection from "../components/TitleSection";
import { movies } from "../data/movies";
import BlurCircle from "../components/BlurCircle";
const Movies = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <BlurCircle top="150px" left="0" />
      <BlurCircle bottom="50px" right="50px" />
      <TitleSection title="Now Showing" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {movies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Movies;
