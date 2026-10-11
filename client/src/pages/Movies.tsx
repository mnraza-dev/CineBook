import { useState } from "react";
import { Input } from "@/components/ui/input";
import MovieCard from '@/components/MovieCard';
import TitleSection from '@/components/TitleSection';
import ResourceState from '@/components/ResourceState';
import { useResource } from '@/hooks/useResource';
import type { Movie } from '@/types';
export default function Movies() {
  const [query, setQuery] = useState("");
  const state = useResource<Movie[]>('/movies');
  if (state.loading || state.error) return <ResourceState {...state} retry={state.reload} />;
  const movies = state.data?.filter(movie => `${movie.title} ${movie.genres.map(g => g.name).join(" ")}`.toLowerCase().includes(query.toLowerCase())) || [];
  return <section className="px-6 md:px-16 lg:px-24 py-10"><TitleSection title="Now Showing" /><label className="block mb-6">Search movies<Input value={query} onChange={e => setQuery(e.target.value)} placeholder="Title or genre" /></label>
    {movies.length ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{movies.map(movie => <MovieCard key={movie._id} movie={movie} />)}</div> : <p>No movies match your search, or no upcoming shows are scheduled.</p>}
  </section>;
}
