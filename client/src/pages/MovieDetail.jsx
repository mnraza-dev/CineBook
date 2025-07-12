import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import { Loader } from "lucide-react";
import { movies } from "../data/movies";
const MovieDetail = () => {
  const { id } = useParams();
  const [show, setShow] = useState(false);
  const getShow = () => {
    const show = movies.find((show) => show._id === id);
    setShow({
      movie: show,
      dateTime: dummyDateTimeData,
    });
  };
  useEffect(() => {
    getShow();
  }, [id]);

  return show ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl  items-center justify-center mx-auto">
        <img src={show.movie.posterUrl} alt={show.movie.title} />
      </div>
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto mt-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{show.movie.title}</h1>
          {/* <p className="text-gray-600 mt-2">{show.movie.description}</p> */}
          <p className="text-gray-500 mt-2">
            Release Date: {show.movie.releaseDate}
          </p>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Showtimes</h2>
          <ul className="mt-2">
            {/* {dummyShowsData.map((time, index) => (
              <li key={index} className="text-gray-700">
                {time}
              </li>
            ))} */}
          </ul>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};
export default MovieDetail;
