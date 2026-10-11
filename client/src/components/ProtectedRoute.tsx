import { useAuth, SignInButton } from '@clerk/clerk-react';
import { Outlet } from 'react-router-dom';
import { useResource } from '@/hooks/useResource';
import ResourceState from './ResourceState';
import { Button } from './ui/button';
export default function ProtectedRoute({ admin = false }: { admin?: boolean }) {
  const { isLoaded, isSignedIn } = useAuth();
  const state = useResource<{ isAdmin: boolean }>(isLoaded && isSignedIn && admin ? '/me' : null);
  if (!isLoaded) return <p className="p-20">Loading session…</p>;
  if (!isSignedIn) return <div className="p-24 text-center"><p className="mb-4">Sign in to continue.</p><SignInButton mode="modal"><Button>Sign in</Button></SignInButton></div>;
  if (admin && (state.loading || state.error || !state.data)) return <ResourceState {...state} loading={state.loading || (!state.data && !state.error)} retry={state.reload} />;
  if (admin && !state.data?.isAdmin) return <p role="alert" className="p-24 text-center">Administrator access required.</p>;
  return <Outlet />;
}
