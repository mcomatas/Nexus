import { db } from "../db.ts";

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
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [session] = await db`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (${token}, ${userId}, ${expiresAt})
    RETURNING *;
  `;

  return session;
}
