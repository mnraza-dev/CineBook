import React, { useEffect, useState } from 'react';
import { dummyDashboardData } from "../../assets/assets";
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, UsersIcon } from "lucide-react";
import TitleSection from '../../components/TitleSection';
import Loading from "../../components/Loading";

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

  const fetchDashboardData = async () => {
    setDashboardData(dummyDashboardData);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return !loading ? (
    <div className="p-6 space-y-2">
      <TitleSection title={'Dashboard'} className='text-3xl' />
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
      <div className="mt-6 p-6 bg-gray-900 rounded-xl shadow">
        <TitleSection className="text-2xl " title={"Active Shows"} />
        {dashboardData.activeShows.length > 0 ? (
          <ul className="space-y-2">
            {dashboardData.activeShows.map((show, idx) => (
              <li key={idx} className="p-8 border rounded hover:bg-gray-400/60 transition">{show.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No active shows currently.</p>
        )}
      </div>
    </div>
  ) : <Loading />;
};

export default Dashboard;
