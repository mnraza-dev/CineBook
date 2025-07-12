import React from "react";
import { StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-xs bg-[#1a1a1a] rounded-xl overflow-hidden shadow-lg hover:scale-[1.03] transition-transform duration-300">
      <img
        onClick={() => navigate(`/movies/${movie._id}`)}
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-72 object-cover"
      />

      <div className="p-4 text-white">
        <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
        <p className="text-sm text-gray-400">{movie.genre}</p>

        <div className="mt-2 flex items-center gap-1 text-yellow-400">
          <StarIcon className="w-4 h-4" />
          <span className="text-sm">{movie.rating}</span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
