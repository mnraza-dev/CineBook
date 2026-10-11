import { useResource } from '@/hooks/useResource';
import type { Movie } from '@/types';
import { Button } from './ui/button';
export default function TrailersSection() {
  const state = useResource<Movie[]>('/movies');
  const movies = state.data?.filter(movie => movie.trailerUrl) || [];
  if (!movies.length) return null;
  return <section className="px-6 md:px-16 lg:px-24 py-14"><h2 className="text-2xl mb-6">Official trailers</h2><div className="flex flex-wrap gap-4">{movies.map(movie => <Button key={movie._id} asChild variant="outline"><a href={movie.trailerUrl} target="_blank" rel="noreferrer">{movie.title}</a></Button>)}</div></section>;
}
