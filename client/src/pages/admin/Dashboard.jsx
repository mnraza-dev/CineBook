import React, { useEffect, useState } from 'react';
import { dummyDashboardData } from "../../assets/assets";
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UsersIcon } from "lucide-react";
import TitleSection from '../../components/TitleSection';
import Loading from "../../components/Loading";
import dateFormat from '../../lib/dateFormat';

const Dashboard = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeShows: [],
    totalUser: 0
  });
  const [loading, setLoading] = useState(true);

  const dashboardCards = [
    { title: "Total Bookings", value: dashboardData.totalBookings, icon: ChartLineIcon, color: "bg-blue-500" },
    { title: "Total Revenue", value: `${currency}${dashboardData.totalRevenue}`, icon: CircleDollarSignIcon, color: "bg-green-500" },
    { title: "Total Shows", value: dashboardData.activeShows.length, icon: PlayCircleIcon, color: "bg-purple-500" },
    { title: "Total Users", value: dashboardData.totalUser, icon: UsersIcon, color: "bg-yellow-500" },
  ];

  const fetchDashboardData = () => {
    setDashboardData(dummyDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <TitleSection title="Admin Dashboard" className="text-3xl" />

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {dashboardCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className={`flex items-center p-8 bg-gray-900/60 border-gray-700/80 border-2 rounded-xl shadow hover:shadow-lg transition-shadow`}>
              <div className={`p-3 rounded-full ${card.color} text-white mr-4`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-lg text-gray-200 mb-4">{card.title}</p>
                <p className="text-4xl text-center font-semibold text-gray-50">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Shows */}
      <div className="mt-6 p-6 bg-gray-900 rounded-xl shadow">
        <TitleSection className="text-2xl mb-4" title="Active Shows" />
        {dashboardData.activeShows.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dashboardData.activeShows.map((show) => (
              <div
                key={show._id}
                className="w-full max-w-xs bg-[#050504] rounded-xl overflow-hidden shadow-lg hover:scale-105 hover:duration-300 hover:ease-in-out "
              >
                <img
                  src={show.movie.poster_path}
                  alt={show.movie.title}
                  className="rounded-lg h-72 object-cover w-full"
                />
                <div className="p-4 text-white">
                  <h3 className="text-lg font-semibold truncate">{show.movie.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(show.movie.release_date).getFullYear()} •{" "}
                    {show.movie.genres.map((genre) => genre.name).slice(0, 2).join(" | ")} •{" "}
                    {show.movie.runtime} min
                  </p>
                 <div className='flex justify-between items-center
                 '>
                   <div className="mt-2  flex items-center gap-1">
                    <span>{currency}</span>
                    <span>{show.showPrice}</span>
                  </div>
                  <div className="mt-2 text-yellow-400 flex items-center gap-1">
                    <span>⭐</span>
                    <span>{show.movie.vote_average?.toFixed(1) || "N/A"}</span>
                  </div>
                 </div>
                  <div className="mt-2 flex text-gray-400 items-center gap-1">
                    <span>{dateFormat(show.showDateTime) || "N/A"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No active shows currently.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
