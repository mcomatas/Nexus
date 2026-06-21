import { cookies } from "next/headers";
import { User } from '@/lib/types';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { "Cookie": cookieStore.toString() },
    cache: "no-store",
  });
  if (!res.ok) return null; // 401, not logged in
  return res.json();
}
