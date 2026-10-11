import { useResource } from '@/hooks/useResource';
import { money } from '@/lib/api';
import type { Booking } from '@/types';
import ResourceState from '@/components/ResourceState';
import TitleSection from '@/components/TitleSection';
export default function ListBookings() {
  const state = useResource<Booking[]>('/admin/bookings');
  if (state.loading || state.error) return <ResourceState {...state} retry={state.reload} />;
  return <section><TitleSection title="All Bookings" /><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr><th>Reference / customer</th><th>Movie</th><th>Date</th><th>Seats</th><th>Amount</th><th>Status</th></tr></thead><tbody>{state.data?.map(booking => <tr key={booking._id} className="border-b border-input"><td className="py-4 text-xs">{booking._id}<br />{booking.userId}</td><td>{booking.show.movie.title}</td><td>{new Date(booking.show.showDateTime).toLocaleString()}</td><td>{booking.bookedSeats.join(', ')}</td><td>{money(booking.amount / 100, booking.currency)}</td><td>{booking.status}</td></tr>)}</tbody></table></div>{!state.data?.length && <p>No bookings yet.</p>}</section>;
}
