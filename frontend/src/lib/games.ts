

export async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${path}`, { credentials: "include", ...init });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}
