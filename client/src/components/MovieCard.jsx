import { ArrowRight, StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import timeFormat from "../lib/timeFormat";
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-xs bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-300">
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`);
          window.scrollTo(0, 0);
        }}
        src={movie.poster_path}
        alt={movie.title}
        className="rounded-lg h-auto md:object-center cursor-pointer w-full object-center"
      />

      <div className="p-4 text-white">
        <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
        <p className="text-sm text-gray-400">
          {new Date(movie.release_date).getFullYear()} •{" "}
          {movie.genres.map(genre => genre.name).slice(0, 2).join(" | ")} • {timeFormat(movie.runtime)}{" "}
          min
        </p>
        <div className="mt-2 flex items-center justify-between text-yellow-400">
          <button
            onClick={() => {
              navigate(`/movies/${movie._id}`);
              window.scrollTo(0, 0);
            }}
            className="login-gradient-soft hover:bg-[#f5ec9b] border-2 border-[#9d9974] hover:border-2 hover:border-[#f5ec9b] text-black px-2 py-1 text-sm  rounded-lg flex items-center gap-1 hover:opacity-90 transition font-medium cursor-pointer"
          >
            Buy Ticket
            <ArrowRight className="inline-block ml-2 w-4 h-4" />
          </button>
          <div className="flex items-center gap-1">
            <StarIcon className="w-4 h-4" />
            <span className="text-sm">{movie.vote_average?.toFixed(1) || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
