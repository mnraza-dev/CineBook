import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TitleSection from "../components/TitleSection";
import {
  dummyDateTimeData,
  dummyShowsData,
  dummyCastsData,
} from "../assets/assets";
import { Star, Heart, Play, Clock, Calendar, Globe, Film } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import { Move3dIcon } from "lucide-react";
import { PlayCircle } from "lucide-react";
import { ArrowRight } from "lucide-react";
const MovieDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const getShow = () => {
    const show = dummyShowsData.find((show) => show._id === id);
    setShow({
      movie: show,
      dateTime: dummyDateTimeData,
    });
  };
  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden py-8">
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
        {/* Left Side - Movie Poster */}
        <div className="lg:w-1/3">
          <img
            src={show.movie.poster_path}
            alt={show.movie.title}
            className="rounded-xl shadow-2xl w-full max-w-md mx-auto"
          />
        </div>

        {/* Right Side - Movie Details */}
        <div className="lg:w-2/3 space-y-6">
          {/* Movie Title and Language */}
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white">
              {show.movie.title}
            </h1>
            <div className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full">
              <Globe className="w-4 h-4 text-logo-color-light" />
              <span className="text-sm text-gray-300 uppercase">
                {show.movie.original_language}
              </span>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-logo-color-light fill-current" />
              <span className="text-lg font-semibold text-white">
                {show.movie.vote_average?.toFixed(1) || "N/A"}
              </span>
            </div>
            <span className="text-gray-400">/ 10</span>
            <span className="text-gray-500">
              ({show.movie.vote_count?.toLocaleString()} votes)
            </span>
          </div>

          {/* Movie Overview */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Overview</h3>
            <p className="text-gray-300 leading-relaxed">
              {show.movie.overview}
            </p>
          </div>

          {/* Movie Details - Duration, Genre, Release Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-logo-color-light" />
              <div>
                <p className="text-sm text-gray-400">Duration</p>
                <p className="text-white font-medium">
                  {timeFormat(show.movie.runtime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Film className="w-6 h-6 text-logo-color-light" />
              <div>
                <p className="text-sm text-gray-400">Genre</p>
                <p className="text-white font-medium">
                  {show.movie.genres.map((genre) => genre.name).join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-logo-color-light" />
              <div>
                <p className="text-sm text-gray-400">Release Date</p>
                <p className="text-white font-medium">
                  {new Date(show.movie.release_date).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button className="cursor-pointer flex items-center gap-2 bg-gray-700/65 hover:bg-gray-700/45 text-white px-6 h-12 rounded-lg font-medium transition-colors">
              <PlayCircle className="w-6 h-6 text-white" />
              Watch Trailer
            </button>
            <button className="login-gradient-diagonal hover:bg-[#ddd47c] text-black h-12 px-6 py-0 text-sm rounded-lg flex items-center gap-2 hover:opacity-90 transition font-medium cursor-pointer">
              Buy Ticket
              <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </button>
            <button className="flex items-center justify-center h-12 w-12 rounded-lg transition-colors">
              <Heart className="w-6 h-6 text-red-200 cursor-pointer hover:text-red-600" />
            </button>
          </div>

          {/* Cast Section */}
        </div>
      </div>
      <div className="mt-8">
        <TitleSection title={"Movie Cast"} className="text-xl" />
     
        <div className="flex gap-4 overflow-x-auto pb-4">
          {dummyCastsData.slice(0, 8).map((cast, index) => (
            <div key={index} className="flex-shrink-0 text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                <img
                  src={cast.profile_path}
                  alt={cast.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/64x64/666666/ffffff?text=?"; // Fallback image
                  }}
                />
              </div>
              <p className="text-sm text-gray-300 font-medium truncate w-16">
                {cast.name}
              </p>
            </div>
          ))}
        </div>
      </div>
      {/* Showtimes Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-white mb-4">Showtimes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(dummyDateTimeData)
            .slice(0, 3)
            .map(([date, times]) => (
              <div key={date} className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-white font-medium mb-2">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {times.slice(0, 3).map((timeSlot, index) => (
                    <button
                      key={index}
                      className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      {new Date(timeSlot.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};
export default MovieDetail;
