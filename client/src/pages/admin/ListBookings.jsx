import React, { useEffect, useState } from 'react';
import TitleSection from '../../components/TitleSection';
import Loading from '../../components/Loading';
import { dummyBookingData, dummyShowsData } from "../../assets/assets";
import dateFormat from '../../lib/dateFormat';

const ListBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getAllBookings = async () => {
      setBookings(dummyBookingData || []);
      setLoading(false);
    };
    getAllBookings();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <TitleSection title="List Bookings" className="text-3xl mb-6" />
      {bookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 text-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800">
              <tr>
                <th className="py-3 px-4 text-left">User Name</th>
                <th className="py-3 px-4 text-left">Movie Name</th>
                <th className="py-3 px-4 text-left">Show Time</th>
                <th className="py-3 px-4 text-left">Seats</th>
                <th className="py-3 px-4 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr key={booking._id || idx} className="border-b border-gray-700 hover:bg-gray-800 transition">
                  <td className="py-3 px-4">{booking.user?.name || "N/A"}</td>
                  <td className="py-3 px-4">{booking.show?.movie?.title || "N/A"}</td>
                  <td className="py-3 px-4">{dateFormat(booking.show?.showDateTime)}</td>
                  <td className="py-3 px-4">{booking.bookedSeats.join(", ")}</td>
                  <td className="py-3 px-4"><span className='mr-1'>{currency}</span>{booking.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 mt-4">No bookings available currently.</p>
      )}
    </div>
  );
};

export default ListBookings;
