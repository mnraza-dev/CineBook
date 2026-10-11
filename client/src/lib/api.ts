import { useAuth } from '@clerk/clerk-react';
import { useCallback } from 'react';
export function useApi() {
  const { getToken, userId, sessionId } = useAuth();
  return useCallback(async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
    const token = userId && sessionId ? await getToken() : null;
    const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}${path}`, {
      ...init, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data as T;
  }, [getToken, userId, sessionId]);
}
export function money(amount: number, currency = 'inr') {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
}
export function errorMessage(error: unknown) { return error instanceof Error ? error.message : 'Something went wrong'; }
