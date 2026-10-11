import { useState, type FormEvent } from 'react';
import toast from 'react-hot-toast';
import { useResource } from '@/hooks/useResource';
import { useApi, errorMessage } from '@/lib/api';
import type { Movie } from '@/types';
import ResourceState from '@/components/ResourceState';
import TitleSection from '@/components/TitleSection';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export default function AddShows() {
  const movies = useResource<Movie[]>('/admin/movies');
  const api = useApi();
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>, kind: 'movie' | 'show') {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    setBusy(true);
    try {
      const body = kind === 'show' ? { movieId: values.movieId, showDateTime: new Date(String(values.showDateTime)).toISOString(), showPrice: Number(values.showPrice) }
        : { title: values.title, overview: values.overview, poster_path: values.poster_path, runtime: Number(values.runtime), original_language: values.original_language || 'en', ...(values.trailerUrl ? { trailerUrl: values.trailerUrl } : {}) };
      await api(`/admin/${kind === 'movie' ? 'movies' : 'shows'}`, { method: 'POST', body: JSON.stringify(body) });
      toast.success(kind === 'movie' ? 'Movie saved' : 'Show scheduled'); form.reset(); movies.reload();
    } catch (error) { toast.error(errorMessage(error)); }
    finally { setBusy(false); }
  }
  return <section className="space-y-8 max-w-2xl"><TitleSection title="Movies & Shows" />
    <form onSubmit={e => submit(e, 'movie')} className="space-y-4 border border-input p-6 rounded-xl"><h2 className="text-xl">Add a movie</h2>
      <label className="block">Title<Input name="title" required maxLength={200} /></label>
      <label className="block">Overview<textarea name="overview" maxLength={5000} className="w-full rounded-md border border-input p-3" /></label>
      <label className="block">Poster URL<Input name="poster_path" type="url" required /></label>
      <label className="block">Runtime (minutes)<Input name="runtime" type="number" min={1} max={600} required /></label>
      <label className="block">Language code<Input name="original_language" defaultValue="en" minLength={2} maxLength={10} /></label>
      <label className="block">YouTube trailer URL (optional)<Input name="trailerUrl" type="url" /></label>
      <Button disabled={busy}>Save movie</Button>
    </form>
    <ResourceState {...movies} retry={movies.reload} />
    <form onSubmit={e => submit(e, 'show')} className="space-y-4 border border-input p-6 rounded-xl"><h2 className="text-xl">Schedule a show</h2>
      <label className="block">Movie<select name="movieId" required className="w-full bg-background border border-input p-3 rounded-md"><option value="">Select movie</option>{movies.data?.map(movie => <option key={movie._id} value={movie._id}>{movie.title}</option>)}</select></label>
      <label className="block">Show date and time (your local timezone)<Input type="datetime-local" name="showDateTime" required /></label>
      <label className="block">Price per seat ({import.meta.env.VITE_CURRENCY || '₹'})<Input type="number" name="showPrice" min="0.01" step="0.01" required /></label>
      <p className="text-sm text-gray-400">Schedule at least one hour ahead. The cinema timezone is used to group dates for customers.</p>
      <Button disabled={busy || !movies.data?.length}>Schedule show</Button>
    </form>
  </section>;
}
