import { NavLink } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
export default function AdminSidebar() {
  const { signOut } = useClerk();
  return <nav className="flex md:flex-col gap-2 p-4 overflow-x-auto" aria-label="Administration">
    { [['Dashboard', '/admin'], ['Movies & shows', '/admin/add-shows'], ['Shows', '/admin/list-shows'], ['Bookings', '/admin/list-bookings']].map(([label, path]) => <NavLink key={path} to={path} end className={({ isActive }) => `px-4 py-3 rounded-md whitespace-nowrap ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>{label}</NavLink>)}
    <Button variant="outline" onClick={() => signOut({ redirectUrl: '/' })}>Sign out</Button>
  </nav>;
}
