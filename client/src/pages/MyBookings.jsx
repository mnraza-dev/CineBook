import { useEffect, useState } from "react";
import { dummyBookingData } from "../assets/assets";
import Loading from "../components/Loading";
import BlurCircle from "../components/BlurCircle";
import TitleSection from "../components/TitleSection";
import { Calendar, Clock, MapPin, Ticket } from "lucide-react";
import timeFormat from "../lib/timeFormat";
import dateFormat from "../lib/dateFormat";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMyBookings = async () => {
    setBookings(dummyBookingData);
    setIsLoading(false);
  };

  useEffect(() => {
    getMyBookings();
  }, []);

  return !isLoading ? (
    <div className="relative px-6 md:px-16 lg:px-40 pt-8 md:pt-10 min-h-[80vh]">
      <BlurCircle top={"100px"} left={"100px"} />
      <div>
        <BlurCircle bottom={"0"} left={"700px"} />
      </div>

      <TitleSection title={"My Bookings"} className="text-2xl mb-8" />

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Ticket className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            No Bookings Yet
          </h3>
          <p className="text-gray-500 text-center">
            You haven't made any bookings yet. Start by exploring our movies!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((item, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-[#23231d] via-[#000000] to-[#21211b] border border-gray-700/50 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:border-gray-600/50"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Movie Poster */}
                <div className="flex-shrink-0 flex justify-center lg:justify-start">
                  <img
                    src={item.show.movie.poster_path}
                    alt={item.show.movie.title}
                    className="w-36 h-52 md:w-44 md:h-64 object-cover rounded-xl shadow-lg"
                  />
                </div>

                {/* Booking Details */}
                <div className="flex-1 space-y-6">
                  {/* Movie Title and Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                        {item.show.movie.title}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {timeFormat(item.show.movie.runtime)}
                        </span>
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {dateFormat(item.show.showDateTime)}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge or Pay Now Button */}
                    {item.isPaid ? (
                      <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-green-400 font-medium text-sm">
                          Confirmed
                        </span>
                      </div>
                    ) : (
                      <button className="bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30 transform hover:-translate-y-1 text-lg relative overflow-hidden group border border-green-400/30">
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <span className="relative flex items-center gap-3">
                          <span className="text-xl">💳</span>
                          Pay Now
                          <span className="text-lg">→</span>
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Amount Section */}
                  <div className="mt-6 p-6 bg-gradient-to-br from-gray-800/40 via-gray-900/40 to-gray-800/40 rounded-2xl border border-gray-600/20 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider">
                          Total Amount
                        </h3>
                        <p className="text-logo-gradient font-bold text-4xl">
                         ₹ {currency} {item.amount || "25.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Show Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Clock className="w-4 h-4 text-logo-color-secondary" />
                        <span className="font-medium">Show Time</span>
                      </div>
                      <p className="text-white font-semibold">
                        {new Date(item.show.showDateTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin className="w-4 h-4 text-logo-color-secondary" />
                        <span className="font-medium">Theater</span>
                      </div>
                      <p className="text-white font-semibold">
                        CineBook Theater
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-300">
                        <Ticket className="w-4 h-4 text-logo-color-secondary" />
                        <span className="font-medium">Seats</span>
                      </div>
                      <p className="text-white font-semibold">
                        {item.bookedSeats?.join(", ") || "A1, A2, A3"}
                      </p>
                    </div>
                  </div>
                  {/* Payment and Booking Summary */}
                  <div className="pt-6 border-t border-gray-700/50">
                  

                    {/* Booking Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-gradient-to-br from-gray-800/40 via-gray-900/40 to-gray-800/40 rounded-2xl p-8 border border-gray-600/20 shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl flex items-center justify-center shadow-lg">
                            <Ticket className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="text-gray-300 font-bold text-lg">
                              Booking Summary
                            </h4>
                            <p className="text-gray-500 text-sm">
                              Ticket information
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                            <div>
                              <span className="text-gray-400 text-sm font-medium">
                                Total Tickets
                              </span>
                              <p className="text-gray-300 text-xs">
                                Number of seats booked
                              </p>
                            </div>
                            <span className="text-white font-bold text-3xl">
                              {item.bookedSeats?.length || 0}
                            </span>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                            <div>
                              <span className="text-gray-400 text-sm font-medium">
                                Price per Ticket
                              </span>
                              <p className="text-gray-300 text-xs">
                                Individual seat cost
                              </p>
                            </div>
                            <span className="text-white font-bold text-xl">
                              {currency}{" "}
                              {(
                                item.amount / (item.bookedSeats?.length || 1)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-gray-800/40 via-gray-900/40 to-gray-800/40 rounded-2xl p-8 border border-gray-600/20 shadow-lg">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-xl flex items-center justify-center shadow-lg">
                            <MapPin className="w-6 h-6 text-purple-400" />
                          </div>
                          <div>
                            <h4 className="text-gray-300 font-bold text-lg">
                              Seat Details
                            </h4>
                            <p className="text-gray-500 text-sm">
                              Your selected seats
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                            <span className="text-gray-400 text-sm font-medium block mb-3">
                              Selected Seats
                            </span>
                            <div className="flex flex-wrap gap-3">
                              {item.bookedSeats?.map((seat, index) => (
                                <span
                                  key={index}
                                  className="bg-gradient-to-r from-purple-500/30 to-blue-500/30 text-white px-4 py-3 rounded-xl text-sm font-bold border border-purple-500/40 hover:from-purple-500/40 hover:to-blue-500/40 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                  {seat}
                                </span>
                              )) || (
                                <span className="text-gray-500 text-sm italic">
                                  No seats selected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <Loading />
  );
};

export default MyBookings;
