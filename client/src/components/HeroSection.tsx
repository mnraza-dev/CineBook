import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
const CinemaScene = lazy(() => import('./CinemaScene'));
import { Button } from './ui/button';
export default function HeroSection() {
  return <section className="relative isolate flex flex-col items-start justify-center gap-6 px-6 md:px-16 lg:px-36 bg-[url('/backgroundImage.png')] bg-cover bg-center min-h-[70vh]">
    <div className="absolute inset-0 bg-black/60 -z-10" /><Suspense fallback={null}><CinemaScene /></Suspense>
    <p className="uppercase tracking-[0.3em] text-logo-color-light">Your next cinema night</p>
    <h1 className="text-5xl md:text-7xl font-semibold max-w-2xl">Great stories.<br />Your favorite seats.</h1>
    <p className="text-gray-300 max-w-lg">Find a film, choose your showtime, and reserve your seats for the big screen.</p>
    <Button asChild size="lg"><Link to="/movies">Explore movies</Link></Button>
  </section>;
}
