import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { useResource } from '@/hooks/useResource';
import { useApi, errorMessage, money } from '@/lib/api';
import type { MovieShow } from '@/types';
import ResourceState from '@/components/ResourceState';
import { Button } from '@/components/ui/button';
export default function SeatLayout() {
  const { id, date } = useParams();
  const api = useApi();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const state = useResource<MovieShow>(`/movies/${id}`);
  const [showId, setShowId] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const seats = useResource<{ occupiedSeats: string[]; showPrice: number; currency: string }>(showId ? `/shows/${showId}/seats` : null);
  useEffect(() => {
    if (!showId) return;
    const timer = setInterval(seats.reload, 15000);
    return () => clearInterval(timer);
  }, [showId, seats.reload]);
  async function checkout() {
    if (!isSignedIn) return openSignIn();
    if (!showId || !selectedSeats.length) return toast.error('Select a show and seats');
    setBusy(true);
    try {
      const result = await api<{ url: string }>('/bookings', { method: 'POST', body: JSON.stringify({ showId, seats: selectedSeats }) });
      window.location.assign(result.url);
    } catch (error) { toast.error(errorMessage(error)); seats.reload(); setSelectedSeats([]); }
    finally { setBusy(false); }
  }
  if (state.loading || state.error) return <ResourceState {...state} retry={state.reload} />;
  const times = state.data?.dateTime[date || ''] || [];
  return <section className="px-4 md:px-16 py-12 space-y-8 max-w-5xl mx-auto">
    <h1 className="text-3xl text-logo-gradient">{state.data?.movie.title} · Choose your seats</h1>
    <div className="flex gap-3 flex-wrap">{times.map(time => <Button key={time.showId} variant={showId === time.showId ? 'default' : 'outline'} onClick={() => { setShowId(time.showId); setSelectedSeats([]); }}>{new Date(time.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {money(time.showPrice, time.currency)}</Button>)}</div>
    {!times.length && <p>No available shows for this date.</p>}
    {showId && <><ResourceState {...seats} retry={seats.reload} />
      {!seats.loading && !seats.error && <>
        <div className="border-t-4 border-secondary rounded-t-[50%] pt-4 text-center text-gray-400">SCREEN</div>
        <p className="text-sm text-center">Choose up to 5 seats. Unavailable seats are disabled.</p>
        <div className="overflow-x-auto"><div className="grid grid-cols-9 gap-2 min-w-[360px] max-w-xl mx-auto" role="group" aria-label="Cinema seats">
          {'ABCDEFGHIJ'.split('').flatMap(row => Array.from({ length: 9 }, (_, i) => {
            const seat = `${row}${i + 1}`;
            const occupied = seats.data?.occupiedSeats.includes(seat);
            return <Button key={seat} size="icon" variant={selectedSeats.includes(seat) ? 'default' : 'outline'} disabled={occupied || busy} aria-label={`${seat}${occupied ? ', unavailable' : ''}`} aria-pressed={selectedSeats.includes(seat)} onClick={() => {
              if (selectedSeats.includes(seat)) setSelectedSeats(s => s.filter(x => x !== seat));
              else if (selectedSeats.length < 5) setSelectedSeats(s => [...s, seat]);
              else toast.error('Choose at most five seats');
            }} className="w-full text-xs">{seat}</Button>;
          }))}
        </div></div>
        <p>Selected: {selectedSeats.join(', ') || 'None'} · Total: {money(selectedSeats.length * (seats.data?.showPrice || 0), seats.data?.currency)}</p>
        <Button onClick={checkout} disabled={busy || !selectedSeats.length || selectedSeats.some(s => seats.data?.occupiedSeats.includes(s))}>{busy ? 'Preparing secure checkout…' : 'Proceed to Checkout'}</Button>
        <p className="text-sm text-gray-400">Seats are reserved during checkout. Your booking is confirmed after payment.</p>
      </>}
    </>}
  </section>;
}
