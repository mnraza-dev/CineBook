import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import TitleSection from "./TitleSection";
import BlurCircle from "./BlurCircle";
const DateSelect = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(0);

  const generateDates = (weekOffset = 0) => {
    const dates = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + weekOffset * 7);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handleDateSelect = (index) => {
    setSelectedDate(index);
  };

  const handlePrevWeek = () => {
    setCurrentWeek((prev) => Math.max(0, prev - 1));
    setSelectedDate(0);
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => prev + 1);
    setSelectedDate(0);
  };

  return (
    <div className="relative mt-8">
      <TitleSection title={"Choose Date"} className="text-xl" />
      <BlurCircle  top="-400px" right="-200px" />
      <BlurCircle  top="100px" left="-250px" />
     
      {/* Cool Box Container with Gradient */}
      <div className="mt-6  p-6 rounded-2xl bg-gradient-to-br from-[#23231d] via-[#000000] to-[#21211b] border border-gray-700/50 shadow-2xl">
        <div className="flex items-center justify-between gap-4">
          {/* First Div: Navigation and Date Cards */}
          <div className="flex items-center gap-4">

            {/* Previous Arrow */}
            <button
              onClick={handlePrevWeek}
              disabled={currentWeek === 0}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                currentWeek === 0
                  ? "bg-gray-800/80 text-gray-500"
                  : "login-gradient-diagonal text-black hover:opacity-90"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Date Cards */}
            <div className="flex gap-3 overflow-x-auto flex-1 justify-end">
              {generateDates(currentWeek).map((date, index) => {
                const isToday = currentWeek === 0 && index === 0;
                const isSelected = index === selectedDate;

                return (
                  <div
                    key={index}
                    onClick={() => handleDateSelect(index)}
                    className={`flex-shrink-0 cursor-pointer rounded-lg p-3 min-w-[70px] text-center transition-all ${
                      isSelected
                        ? "login-gradient-diagonal text-black font-semibold shadow-lg"
                        : isToday
                        ? "bg-transparent text-white border-2 border-logo-color-light"
                        : "bg-transparent hover:bg-gray-700/20 text-white border border-gray-600/30"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-xl font-bold">{date.getDate()}</div>
                    <div className="text-xs opacity-75">
                      {date.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Arrow */}
            <button
              onClick={handleNextWeek}
              className="flex items-center justify-center w-10 h-10 rounded-full login-gradient-diagonal text-black hover:opacity-90 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Second Div: Book Now Button */}
          <div className="flex-shrink-0">
            <button className="login-gradient-diagonal hover:bg-[#ddd47c] text-black px-6 py-3 rounded-lg font-semibold text-base hover:opacity-90 transition-all cursor-pointer flex items-center gap-2 shadow-lg">
              Book Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateSelect;
