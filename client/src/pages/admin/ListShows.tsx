import { useState } from 'react';
import toast from 'react-hot-toast';
import { useResource } from '@/hooks/useResource';
import { useApi, money, errorMessage } from '@/lib/api';
import type { Show } from '@/types';
import ResourceState from '@/components/ResourceState';
import TitleSection from '@/components/TitleSection';
import { Button } from '@/components/ui/button';
export default function ListShows() {
  const state = useResource<Show[]>('/admin/shows');
  const api = useApi();
  const [busy, setBusy] = useState('');
  async function remove(id: string) {
    setBusy(id);
    try { await api(`/admin/shows/${id}`, { method: 'DELETE' }); state.reload(); toast.success('Show removed'); }
    catch (error) { toast.error(errorMessage(error)); }
    finally { setBusy(''); }
  }
  if (state.loading || state.error) return <ResourceState {...state} retry={state.reload} />;
  return <section><TitleSection title="Shows" /><div className="overflow-x-auto"><table className="w-full text-left"><thead><tr><th>Movie</th><th>Date</th><th>Price</th><th>Reserved seats</th><th>Actions</th></tr></thead><tbody>{state.data?.map(show => <tr key={show._id} className="border-b border-input"><td className="py-4">{show.movie.title}</td><td>{new Date(show.showDateTime).toLocaleString()}</td><td>{money(show.showPrice, show.currency)}</td><td>{Object.keys(show.reservations).length}</td><td><Button variant="outline" disabled={busy === show._id || Object.keys(show.reservations).length > 0} onClick={() => remove(show._id)}>Remove</Button></td></tr>)}</tbody></table></div>{!state.data?.length && <p>No shows scheduled.</p>}</section>;
}
