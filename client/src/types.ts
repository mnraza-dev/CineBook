export interface Movie {
  _id: string; title: string; overview: string; poster_path: string; backdrop_path?: string;
  genres: { id: number; name: string }[]; casts: { name: string; profile_path: string }[];
  release_date?: string; original_language: string; tagline?: string; vote_average: number; runtime: number; trailerUrl?: string;
}
export interface ShowTime { time: string; showId: string; showPrice: number; currency: string }
export interface MovieShow { movie: Movie; dateTime: Record<string, ShowTime[]> }
export interface Show { _id: string; movie: Movie; showDateTime: string; showPrice: number; currency: string; reservations: Record<string, string> }
export interface Booking { _id: string; userId: string; show: Show; bookedSeats: string[]; amount: number; currency: string; status: 'pending' | 'paid' | 'cancelled' | 'expired'; createdAt: string; expiresAt: string }
export interface Dashboard { totalBookings: number; totalRevenue: number; totalUser: number; activeShows: Show[] }
