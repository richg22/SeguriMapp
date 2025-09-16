// app/lib/api.ts
export const BASE_URL = 'http://IP:3001'; // ej: 'http://192.168.1.23:3001' [10]

export async function postJSON<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({} as any));
  if (!res.ok) throw new Error(data?.error || 'Error de red');
  return data as T;
}
