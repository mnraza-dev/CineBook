import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Movies from '@/pages/Movies';
import SeatLayout from '@/pages/SeatLayout';
import MyBookings from '@/pages/MyBookings';
import ProtectedRoute from '@/components/ProtectedRoute';
import type { Movie } from '@/types';
const mocks = vi.hoisted(() => ({ api: vi.fn(), openSignIn: vi.fn(), signedIn: true }));
vi.mock('@clerk/clerk-react', () => ({
  useAuth: () => ({ isLoaded: true, isSignedIn: mocks.signedIn }),
  useClerk: () => ({ openSignIn: mocks.openSignIn }),
  SignInButton: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock('@/lib/api', async original => ({ ...await original<object>(), useApi: () => mocks.api }));
const movie: Movie = { _id: 'movie1', title: 'Space Adventure', overview: 'A voyage', poster_path: 'https://example.com/poster.jpg', genres: [{ id: 1, name: 'Adventure' }], casts: [], original_language: 'en', runtime: 120, vote_average: 7 };
afterEach(cleanup);
beforeEach(() => { mocks.api.mockReset(); mocks.signedIn = true; mocks.openSignIn.mockReset(); });
function seatPage() {
  return render(<MemoryRouter initialEntries={['/movies/movie1/2026-12-12']}><Routes><Route path="/movies/:id/:date" element={<SeatLayout />} /></Routes></MemoryRouter>);
}
describe('customer and admin flows', () => {
  it('loads persisted movies and searches by title and genre', async () => {
    mocks.api.mockResolvedValue([movie, { ...movie, _id: 'movie2', title: 'Night Mystery', genres: [{ id: 2, name: 'Thriller' }] }]);
    render(<MemoryRouter><Movies /></MemoryRouter>);
    await screen.findByText('Space Adventure');
    const search = screen.getByRole('textbox', { name: 'Search movies' });
    await userEvent.type(search, 'thriller');
    expect(screen.queryByText('Space Adventure')).toBeNull();
    expect(screen.getByText('Night Mystery')).toBeTruthy();
  });
  it('disables unavailable seats, submits selected seats and recovers from a reservation conflict', async () => {
    mocks.api.mockImplementation(async (path: string, init?: RequestInit) => {
      if (path === '/movies/movie1') return { movie, dateTime: { '2026-12-12': [{ showId: 'show1', time: '2026-12-12T13:00:00Z', showPrice: 250, currency: 'inr' }] } };
      if (path === '/shows/show1/seats') return { occupiedSeats: ['A1'], showPrice: 250, currency: 'inr' };
      if (path === '/bookings') {
        expect(JSON.parse(String(init?.body))).toEqual({ showId: 'show1', seats: ['A2'] });
        throw new Error('Seat was just reserved');
      }
    });
    seatPage();
    await userEvent.click(await screen.findByRole('button', { name: /250/ }));
    const occupied = await screen.findByRole('button', { name: 'A1, unavailable' });
    expect((occupied as HTMLButtonElement).disabled).toBe(true);
    await userEvent.click(screen.getByRole('button', { name: 'A2' }));
    await userEvent.click(screen.getByRole('button', { name: 'Proceed to Checkout' }));
    await waitFor(() => expect(mocks.api).toHaveBeenCalledWith('/bookings', expect.objectContaining({ method: 'POST' })));
    await waitFor(() => expect(screen.getByText(/Selected: None/)).toBeTruthy());
  });
  it('requires sign-in before creating a checkout reservation', async () => {
    mocks.signedIn = false;
    mocks.api.mockImplementation(async (path: string) => path.startsWith('/movies')
      ? { movie, dateTime: { '2026-12-12': [{ showId: 'show1', time: '2026-12-12T13:00:00Z', showPrice: 250, currency: 'inr' }] } }
      : { occupiedSeats: [], showPrice: 250, currency: 'inr' });
    seatPage();
    await userEvent.click(await screen.findByRole('button', { name: /250/ }));
    await userEvent.click(await screen.findByRole('button', { name: 'A1' }));
    await userEvent.click(screen.getByRole('button', { name: 'Proceed to Checkout' }));
    expect(mocks.openSignIn).toHaveBeenCalledOnce();
    expect(mocks.api.mock.calls.some(([path]) => path === '/bookings')).toBe(false);
  });
  it('shows persisted booking status and cancels unpaid reservations through the API', async () => {
    const booking = { _id: 'booking1', status: 'pending', bookedSeats: ['A1'], amount: 25000, currency: 'inr', show: { movie, showDateTime: '2026-12-12T13:00:00Z' } };
    mocks.api.mockImplementation(async (path: string) => path === '/bookings' ? [booking] : { ok: true });
    render(<MemoryRouter><MyBookings /></MemoryRouter>);
    await screen.findByText('Status: pending');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel reservation' }));
    await waitFor(() => expect(mocks.api).toHaveBeenCalledWith('/bookings/booking1/cancel', { method: 'POST' }));
  });
  it('blocks admin content when the server reports an ordinary customer', async () => {
    mocks.api.mockResolvedValue({ isAdmin: false });
    render(<MemoryRouter initialEntries={['/admin']}><Routes><Route element={<ProtectedRoute admin />}><Route path="/admin" element={<p>Secret dashboard</p>} /></Route></Routes></MemoryRouter>);
    await screen.findByText('Administrator access required.');
    expect(screen.queryByText('Secret dashboard')).toBeNull();
  });
});
