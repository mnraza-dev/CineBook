import { useResource } from '@/hooks/useResource';
import { money } from '@/lib/api';
import type { Dashboard as DashboardData } from '@/types';
import ResourceState from '@/components/ResourceState';
import TitleSection from '@/components/TitleSection';
export default function Dashboard() {
  const state = useResource<DashboardData>('/admin/dashboard');
  if (state.loading || state.error) return <ResourceState {...state} retry={state.reload} />;
  if (!state.data) return null;
  const data = state.data;
  return <section><TitleSection title="Dashboard" /><div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[
    ['Paid bookings', data.totalBookings], ['Revenue', money(data.totalRevenue, import.meta.env.VITE_PAYMENT_CURRENCY || 'inr')], ['Upcoming shows', data.activeShows.length], ['Customers', data.totalUser],
  ].map(([label, value]) => <div key={label} className="p-6 border border-input rounded-xl"><p className="text-gray-400">{label}</p><p className="text-2xl mt-3">{value}</p></div>)}</div><h2 className="text-xl my-6">Upcoming shows</h2><div className="space-y-4">{data.activeShows.map(show => <div key={show._id} className="border border-input rounded-lg p-4">{show.movie.title} · {new Date(show.showDateTime).toLocaleString()} · {money(show.showPrice, show.currency)}</div>)}</div></section>;
}
