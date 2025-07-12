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
    </div>
  ) : (
    <div>
      <Loader className="animate-spin text-3xl text-center mt-20 mx-auto" />
    </div>
  );
};

export default MovieDetail;
