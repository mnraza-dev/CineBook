import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useResource } from '@/hooks/useResource';
import { useApi, money, errorMessage } from '@/lib/api';
import type { Booking } from '@/types';
import ResourceState from '@/components/ResourceState';
import TitleSection from '@/components/TitleSection';
import { Button } from '@/components/ui/button';
export default function MyBookings() {
  const state = useResource<Booking[]>('/bookings');
  const api = useApi();
  const [params] = useSearchParams();
  const [busy, setBusy] = useState('');
  useEffect(() => {
    if (!state.data?.some(b => b.status === 'pending')) return;
    const timer = setInterval(state.reload, 10000);
    return () => clearInterval(timer);
  }, [state.data, state.reload]);
  async function action(booking: Booking, kind: 'checkout' | 'cancel' | 'sync') {
    setBusy(booking._id);
    try {
      const result = await api<{ url?: string }>(`/bookings/${booking._id}/${kind}`, { method: 'POST' });
      if (result.url) window.location.assign(result.url);
      else state.reload();
    } catch (error) { toast.error(errorMessage(error)); state.reload(); }
    finally { setBusy(''); }
  }
  if (state.loading || state.error) return <ResourceState {...state} retry={state.reload} />;
  return <section className="px-6 md:px-16 py-10 max-w-6xl mx-auto"><TitleSection title="My Bookings" />
    {params.has('session_id') && <p role="status" className="mb-6">Payment status is verified by the server. Refresh the status below if confirmation is still pending.</p>}
    {params.get('checkout') === 'cancelled' && <p className="mb-6">Checkout was closed. Resume payment or cancel your seat reservation below.</p>}
    {!state.data?.length && <p>No bookings yet. Explore movies to book your first show.</p>}
    <div className="space-y-6">{state.data?.map(booking => <article key={booking._id} className="flex flex-col sm:flex-row gap-6 border border-input rounded-xl p-6">
      <img src={booking.show.movie.poster_path} alt={booking.show.movie.title} className="w-28 rounded-lg" />
      <div className="space-y-3"><h2 className="text-xl font-semibold">{booking.show.movie.title}</h2><p>{new Date(booking.show.showDateTime).toLocaleString()}</p>
        <p>Seats: {booking.bookedSeats.join(', ')} · {money(booking.amount / 100, booking.currency)}</p>
        <p className="capitalize">Status: {booking.status}</p><p className="text-xs text-gray-400">Booking reference: {booking._id}</p>
        {booking.status === 'paid' && <p className="text-green-400">Your seats are confirmed. Present this booking reference at the cinema.</p>}
        {booking.status === 'pending' && <div className="flex gap-2 flex-wrap"><Button disabled={busy === booking._id} onClick={() => action(booking, 'checkout')}>Pay now</Button><Button variant="outline" disabled={busy === booking._id} onClick={() => action(booking, 'sync')}>Refresh status</Button><Button variant="ghost" disabled={busy === booking._id} onClick={() => action(booking, 'cancel')}>Cancel reservation</Button></div>}
      </div>
    </article>)}</div>
  </section>;
}
