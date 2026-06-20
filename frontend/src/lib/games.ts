

export async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(`http://localhost:3000/${path}`, { credentials: "include", ...init });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}
