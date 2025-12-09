const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export async function fetchJSON<TResponse = unknown>(
  path: string,
  init?: RequestInit
): Promise<TResponse> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `API error: ${res.status}`);
  }
  return res.json() as Promise<TResponse>;
}
