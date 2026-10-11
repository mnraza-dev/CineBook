import { Link } from 'react-router-dom';
import { assets } from '@/assets/assets';
export default function Footer() {
  return <footer className="px-6 md:px-16 py-10 border-t border-input mt-12 text-gray-400"><div className="flex flex-wrap justify-between gap-6"><Link to="/"><img src={assets.logo} alt="CineBook" className="w-24" /></Link><p>Find your next movie night. Book your seats securely.</p><nav className="flex gap-4"><Link to="/movies">Movies</Link><Link to="/my-bookings">My bookings</Link><Link to="/favorite">Favorites</Link></nav></div><p className="text-sm mt-8">© {new Date().getFullYear()} CineBook</p></footer>;
}
