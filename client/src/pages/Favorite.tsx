import MovieCard from '@/components/MovieCard';
import TitleSection from '@/components/TitleSection';
import ResourceState from '@/components/ResourceState';
import { useResource } from '@/hooks/useResource';
import type { Movie } from '@/types';
export default function Favorite() {
  const state = useResource<Movie[]>('/user/favorites');
  if (state.loading || state.error) return <ResourceState {...state} retry={state.reload} />;
  return <section className="px-6 md:px-16 lg:px-24 py-10"><TitleSection title="Your Favorite Movies" />
    {state.data?.length ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{state.data.map(movie => <MovieCard key={movie._id} movie={movie} />)}</div> : <p>Save movies using the heart on a movie’s detail page.</p>}
  </section>;
}
