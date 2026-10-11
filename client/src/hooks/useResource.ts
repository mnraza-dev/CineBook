import { useCallback, useEffect, useState, useRef } from 'react';
import { useApi, errorMessage } from '@/lib/api';
export function useResource<T>(path: string | null) {
  const api = useApi();
  const previousApi = useRef(api);
  const previousPath = useRef<string | null>(null);
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => setRevision(n => n + 1), []);
  useEffect(() => {
    let active = true;
    const changed = previousPath.current !== path || previousApi.current !== api;
    previousApi.current = api;
    previousPath.current = path;
    if (changed || !path) setData(null);
    setError('');
    if (changed) setLoading(Boolean(path));
    if (!path) setLoading(false);
    if (path) api<T>(path).then(value => { if (active) setData(value); })
      .catch(e => { if (active) setError(errorMessage(e)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [api, path, revision]);
  return { data, loading, error, reload };
}
