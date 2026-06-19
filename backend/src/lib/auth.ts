import { db } from "../db.ts";

export const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

// Attributes shared by the set + clear session cookies.
// Secure ONLY in production: a Secure cookie is dropped over http://localhost in dev,
// which would silently break the session (login 200s but the cookie never comes back).
function cookieAttrs(maxAge: number) {
  const secure = Bun.env.NODE_ENV === "production" ? "; Secure" : "";
  return `HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function buildSessionCookie(token: string) {
  return `session=${token}; ${cookieAttrs(SESSION_MAX_AGE_SECONDS)}`;
}

export function buildClearCookie() {
  return `session=; ${cookieAttrs(0)}`;
}

export async function getUserId(req: Bun.BunRequest): Promise<string | null> {
  const cookies = req.cookies;
  const sessionCookie = cookies.get("session");
  if (!sessionCookie) return null;

  const [session] = await db`
    SELECT user_id FROM sessions
    WHERE id = ${sessionCookie} AND expires_at > NOW()
  `;
  if (!session) return null;

  return session.user_id;
}

export async function createSession(userId: string) {
  const token = crypto.randomUUID();
  // Make the session expire in 7 days
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000);

  const [session] = await db`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expiresAt})
    RETURNING *;
  `;

  return session;
}
