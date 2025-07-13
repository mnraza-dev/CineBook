import React from "react";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { dummyDateTimeData, dummyShowsData } from "../assets/assets";
import { Clock } from "lucide-react";
import TitleSection from "../components/TitleSection";
const SeatLayout = () => {
  const { id, date } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

  const navigate = useNavigate();
  const getShow = () => {
    const show = dummyShowsData.find((show) => show._id === id);
    if (show) {
      setShow({
        movie: show,
        dateTime: dummyDateTimeData,
      });
    }
  };

  useEffect(() => {
    getShow();
  }, [id]);
  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-20 md:pt-10">
      {/* Available Timings */}
      <div className="md:w-2/5 mb-8 md:mb-0 md:pr-8">
        <TitleSection
          title="Available Timings"
          className="text-xl text-center ml-12"
        />
        {/* Cool Box Container with Gradient */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#23231d] via-[#000000] to-[#21211b] border border-gray-700/50 shadow-2xl">
          <div className="space-y-3">
            {show.dateTime[date]?.map((item, index) => (
              <button
                key={index}
                onClick={() => setSelectedTime(item.time)}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedTime === item.time
                    ? "login-gradient-diagonal text-black font-semibold shadow-lg"
                    : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600/30"
                }`}
              >
                <div className="flex items-center gap-2 justify-between">
                  <Clock className="text-logo-color-secondary w-5 h-6 " />
                  <span className="text-sm font-medium">
                    {new Date(item.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-sm opacity-75">
                    {new Date(item.time).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Seats Layout */}
      <div className="md:w-2/3">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-logo-gradient text-2xl font-semibold">
            Select Your Seats
          </h2>
        </div>
        <p className="text-center text-md">All eyes this way please! </p>
        <div className="bg-gray-800 rounded-lg p-6">
          <p className="text-gray-400 text-center">
            Seat layout will be implemented here
          </p>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
