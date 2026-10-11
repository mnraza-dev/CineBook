import { Link } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';
import { assets } from '@/assets/assets';
export default function AdminNavbar() {
  const { user } = useUser();
  return <header className="flex items-center justify-between p-6 border-b border-input"><Link to="/"><img src={assets.logo} alt="CineBook" className="w-24" /></Link><div className="flex items-center gap-4"><span>{user?.fullName || 'Administrator'}</span><UserButton /></div></header>;
}
