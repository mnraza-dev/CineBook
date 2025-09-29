import React, { useEffect, useState } from 'react';
import TitleSection from '../../components/TitleSection';
import Loading from '../../components/Loading';
import dateFormat from '../../lib/dateFormat';
import { dummyShowsData } from '../../assets/assets';
const ListShows = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllShows = async () => {
    try {
      setShows([
        {
          movie: dummyShowsData[0],
          showDateTime: "2025-06-30T02:30:00.000Z",
          showPrice: 59,
          occupiedSeats: {
            A1: "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
            B1: "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
            C1: "user_2xO4XPCgWWwWq9EHuQxc5UWqIok",
          },
        },
      ]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllShows();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <TitleSection title="List Shows" className="text-3xl mb-6" />
      
      {shows.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-left">Movie Name</th>
                <th className="py-3 px-4 text-left">Show Time</th>
                <th className="py-3 px-4 text-left">Total Bookings</th>
                <th className="py-3 px-4 text-left">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-800 transition">
                  <td className="py-3 px-4">{show.movie.title}</td>
                  <td className="py-3 px-4">{dateFormat(show.showDateTime)}</td>
                  <td className="py-3 px-4">{Object.keys(show.occupiedSeats).length}</td>
                  <td className="py-3 px-4">{currency}{Object.keys(show.occupiedSeats).length * show.showPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 mt-4">No shows available currently.</p>
      )}
    </div>
  );
};

export default ListShows;
