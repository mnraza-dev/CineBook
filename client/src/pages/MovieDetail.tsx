import { useParams } from 'react-router-dom';
import { useAuth, useClerk } from '@clerk/clerk-react';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useResource } from '@/hooks/useResource';
import { useApi, errorMessage } from '@/lib/api';
import type { Movie, MovieShow } from '@/types';
import ResourceState from '@/components/ResourceState';
import DateSelect from '@/components/DateSelect';
import { Button } from '@/components/ui/button';
import timeFormat from '@/lib/timeFormat';
export default function MovieDetail() {
  const { id } = useParams();
  const { isSignedIn } = useAuth();
  const { openSignIn } = useClerk();
  const api = useApi();
  const state = useResource<MovieShow>(`/movies/${id}`);
  const favorites = useResource<Movie[]>(isSignedIn ? '/user/favorites' : null);
  const [saving, setSaving] = useState(false);
  const favorite = favorites.data?.some(movie => movie._id === id) || false;
  async function toggle() {
    if (!isSignedIn) return openSignIn();
    setSaving(true);
    try { await api(`/user/favorites/${id}`, { method: 'PUT', body: JSON.stringify({ favorite: !favorite }) }); favorites.reload(); }
    catch (error) { toast.error(errorMessage(error)); }
    finally { setSaving(false); }
  }
  if (state.loading || state.error) return <ResourceState {...state} retry={state.reload} />;
  if (!state.data) return null;
  const { movie, dateTime } = state.data;
  return <section className="px-6 md:px-16 lg:px-24 py-12 max-w-7xl mx-auto">
    <div className="flex flex-col md:flex-row gap-10">
      <img src={movie.poster_path} alt={movie.title} className="w-64 rounded-xl object-cover" />
      <div className="space-y-6"><h1 className="text-4xl font-semibold text-logo-gradient">{movie.title}</h1>
        <p>{movie.genres.map(g => g.name).join(' · ')} · {timeFormat(movie.runtime)} · {movie.original_language.toUpperCase()}</p>
        <p className="max-w-2xl text-gray-300">{movie.overview}</p>
        <p>Rating: {movie.vote_average.toFixed(1)} / 10</p>
        <div className="flex gap-4">
          {movie.trailerUrl && <Button asChild variant="outline"><a href={movie.trailerUrl} target="_blank" rel="noreferrer">Watch trailer</a></Button>}
          <Button variant="outline" aria-pressed={favorite} disabled={saving || (isSignedIn && (favorites.loading || Boolean(favorites.error)))} onClick={toggle}><Heart fill={favorite ? 'currentColor' : 'none'} />{favorite ? 'Saved' : 'Save movie'}</Button>
        </div>
        {favorites.error && <p role="alert">{favorites.error} <Button variant="link" onClick={favorites.reload}>Retry favorites</Button></p>}
      </div>
    </div>
    {movie.casts.length > 0 && <div className="flex gap-5 overflow-x-auto my-10">{movie.casts.map((cast, i) => <div key={`${cast.name}-${i}`} className="min-w-24 text-center"><img src={cast.profile_path} alt={cast.name} className="w-20 h-20 rounded-full object-cover" /><p>{cast.name}</p></div>)}</div>}
    {Object.keys(dateTime).length ? <DateSelect id={movie._id} dateTime={dateTime} /> : <p className="mt-10">No upcoming shows for this movie.</p>}
  </section>;
}
