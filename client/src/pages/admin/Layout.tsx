import { Outlet } from 'react-router-dom';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminSidebar from '@/components/admin/AdminSidebar';
export default function Layout() {
  return <div className="min-h-screen"><AdminNavbar /><div className="flex flex-col md:flex-row"><aside className="md:w-60 shrink-0"><AdminSidebar /></aside><main className="min-w-0 flex-1 p-6 md:p-10"><Outlet /></main></div></div>;
}
