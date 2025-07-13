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
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-20 py-20 md:pt-10 justify-between">
      {/* Available Timings */}
      <div className="md:w-1/4 mb-8 md:mb-0 md:pr-8">
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
        <p className="text-center text-md mb-6">All eyes this way please! </p>
        
        {/* Seat Layout */}
        <div className="rounded-lg p-6">
          <div className="space-y-4">
            {/* Row A */}
            <div className="flex justify-center gap-2">
              <span className="text-white font-semibold w-8 text-center">A</span>
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`A-${index + 1}`}
                  onClick={() => {
                    const seatId = `A${index + 1}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`A${index + 1}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Row B */}
            <div className="flex justify-center gap-2">
              <span className="text-white font-semibold w-8 text-center">B</span>
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`B-${index + 1}`}
                  onClick={() => {
                    const seatId = `B${index + 1}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`B${index + 1}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* Row C */}
            <div className="flex justify-center gap-2">
              <span className="text-white font-semibold w-8 text-center">C</span>
              {/* First 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`C-${index + 1}`}
                  onClick={() => {
                    const seatId = `C${index + 1}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`C${index + 1}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {/* Space between seat groups */}
              <div className="w-8"></div>
              {/* Last 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`C-${index + 10}`}
                  onClick={() => {
                    const seatId = `C${index + 10}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`C${index + 10}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 10}
                </button>
              ))}
            </div>

            {/* Row D */}
            <div className="flex justify-center gap-2">
              <span className="text-white font-semibold w-8 text-center">D</span>
              {/* First 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`D-${index + 1}`}
                  onClick={() => {
                    const seatId = `D${index + 1}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`D${index + 1}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {/* Space between seat groups */}
              <div className="w-8"></div>
              {/* Last 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`D-${index + 10}`}
                  onClick={() => {
                    const seatId = `D${index + 10}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`D${index + 10}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 10}
                </button>
              ))}
            </div>

            {/* Space after Row D */}
            <div className="h-4"></div>

            {/* Row E */}
            <div className="flex justify-center gap-2">
              <span className="text-white font-semibold w-8 text-center">E</span>
              {/* First 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`E-${index + 1}`}
                  onClick={() => {
                    const seatId = `E${index + 1}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`E${index + 1}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {/* Space between seat groups */}
              <div className="w-8"></div>
              {/* Last 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`E-${index + 10}`}
                  onClick={() => {
                    const seatId = `E${index + 10}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`E${index + 10}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 10}
                </button>
              ))}
            </div>
                      </div>

            {/* Space after Row E */}
            <div className="h-4"></div>

            {/* Row F */}
            <div className="flex justify-center gap-2">
              <span className="text-white font-semibold w-8 text-center">F</span>
              {/* First 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`F-${index + 1}`}
                  onClick={() => {
                    const seatId = `F${index + 1}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`F${index + 1}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {/* Space between seat groups */}
              <div className="w-8"></div>
              {/* Last 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`F-${index + 10}`}
                  onClick={() => {
                    const seatId = `F${index + 10}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`F${index + 10}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 10}
                </button>
              ))}
            </div>

            {/* Space after Row F */}
            <div className="h-4"></div>

            {/* Row G */}
            <div className="flex justify-center gap-2">
              <span className="text-white font-semibold w-8 text-center">G</span>
              {/* First 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`G-${index + 1}`}
                  onClick={() => {
                    const seatId = `G${index + 1}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`G${index + 1}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {/* Space between seat groups */}
              <div className="w-8"></div>
              {/* Last 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`G-${index + 10}`}
                  onClick={() => {
                    const seatId = `G${index + 10}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`G${index + 10}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 10}
                </button>
              ))}
            </div>

            {/* Space after Row G */}
            <div className="h-4"></div>

            {/* Row H */}
            <div className="flex justify-center gap-2">
              <span className="text-white font-semibold w-8 text-center">H</span>
              {/* First 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`H-${index + 1}`}
                  onClick={() => {
                    const seatId = `H${index + 1}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`H${index + 1}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              {/* Space between seat groups */}
              <div className="w-8"></div>
              {/* Last 9 seats */}
              {Array.from({ length: 9 }, (_, index) => (
                <button
                  key={`H-${index + 10}`}
                  onClick={() => {
                    const seatId = `H${index + 10}`;
                    setSelectedSeats(prev => 
                      prev.includes(seatId) 
                        ? prev.filter(s => s !== seatId)
                        : [...prev, seatId]
                    );
                  }}
                  className={`w-8 h-8 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                    selectedSeats.includes(`H${index + 10}`)
                      ? "login-gradient-diagonal text-black shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600"
                  }`}
                >
                  {index + 10}
                </button>
              ))}
            </div>

            {/* Selected Seats Display */}
            {selectedSeats.length > 0 && (
              <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                <p className="text-white/80 font-medium mb-2">Selected Seats:</p>
                <p className="text-logo-color-light/70">{selectedSeats.join(", ")}</p>
              </div>
            )}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
