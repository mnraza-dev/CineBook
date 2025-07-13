import React from "react";
import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import isoTimeFormat from "../lib/isoTimeFormat";
import { useParams } from "react-router-dom";
import { assets, dummyDateTimeData, dummyShowsData } from "../assets/assets";
import { Clock } from "lucide-react";
import TitleSection from "../components/TitleSection";
import toast from "react-hot-toast";
import BlurCircle from "../components/BlurCircle";
import { ArrowRightIcon } from "lucide-react";

const SeatLayout = () => {
  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];
  const { id, date } = useParams();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);

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

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast("Please Select Time First");
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast("You can only select 5 Seats");
    }
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seatId)
        ? prevSeats.filter((seat) => seat !== seatId)
        : [...prevSeats, seatId]
    );
  };

  const renderSeats = (row, count = 9) => {
    return (
      <div key={row} className="flex gap-2 mt-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: count }, (_, i) => {
            const seatId = `${row}${i + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            return (
              <button
                key={seatId}
                onClick={() => handleSeatClick(seatId)}
                className={`h-8 w-8 rounded border border-secondary/60 cursor-pointer text-xs font-medium transition-all flex items-center justify-center ${
                  selectedSeats.includes(seatId)
                    ? "login-gradient-diagonal text-black font-semibold shadow-lg border-transparent"
                    : "bg-gray-700/30 text-gray-300 hover:bg-gray-600/50 hover:border-secondary/80"
                }`}
              >
                {seatId}
              </button>
            );
          })}
        </div>
      </div>
    );
  };
  return show ? (
    <div className="flex flex-col md:flex-row px-6 md:px-16 lg:px-20 py-20 md:pt-10 justify-between">
      {/* Available Timings */}
      <div className="md:w-1/4 mb-8 md:mb-0 md:pr-8">
        <TitleSection
          title="Available Timings"
          className="text-xl text-center ml-0"
        />
        {/* Cool Box Container with Gradient */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#23231d] via-[#000000] to-[#21211b] border border-gray-700/50 shadow-2xl">
          <div className="space-y-3">
            {show.dateTime[date]?.map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`w-full p-4 rounded-lg text-left transition-all 
                  ${
                    selectedTime?.time === item.time
                      ? "login-gradient-diagonal text-black font-semibold shadow-lg"
                      : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600/30"
                  }`}
              >
                <div className="flex items-center gap-2 justify-between">
                  <Clock className="text-logo-color-secondary w-5 h-6 " />
                  <span className="text-sm font-medium">
                    {isoTimeFormat(item.time)}
                  </span>
                  {/* <span className="text-sm opacity-75">
                    {new Date(item.time).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seats Layout */}
      <div className="relative flex-1 flex  flex-col items-center max-md:mt-16  ">
        <div className="flex items-center justify-center mb-6">
          <BlurCircle top="-20px" left="-100px" />
          <BlurCircle bottom="30px" right="0" />
          <h2 className="text-logo-gradient text-2xl font-semibold">
            Select Your Seats
          </h2>
        </div>
        {/* <img src={assets.screenImage} alt="Screen Image" className="" /> */}
        <p className="text-center text-md mb-6">All eyes this way please! </p>

        {/* Seat Layout */}
        <div className=" flex flex-col items-center mt-10 text-xs text-gray-300 ">
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6">
            {groupRows[0].map((row) => renderSeats(row))}
          </div>
          <div className="grid grid-cols-2 gap-11 ">
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>{group.map((row) => renderSeats(row))}</div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center mt-16">
          <button
            onClick={() => {
              navigate("/my-bookings");
              scrollTo(0, 0);
            }}
            className="login-gradient-diagonal hover:bg-[#f5ec9b] border-2 border-[#9d9974] hover:border-2 hover:border-[#f5ec9b] text-black px-6 py-1 text-sm  rounded-md flex items-center gap-2 hover:opacity-90 transition font-medium cursor-pointer"
          >
            Proceed to Checkout
            <ArrowRightIcon className="w-4 h-4 " />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default SeatLayout;
