import Loading from './Loading';
import { Button } from './ui/button';
export default function ResourceState({ loading, error, retry }: { loading: boolean; error: string; retry: () => void }) {
  if (loading) return <Loading />;
  if (error) return <div role="alert" className="p-10 text-center space-y-4"><p>{error}</p><Button onClick={retry}>Try again</Button></div>;
  return null;
}
