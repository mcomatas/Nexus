import { db } from "../db.ts";

//TEMP: until real session exists, id comes from x-user-id header.
// When auth is done, swap this function body
export async function getUserId(req: Bun.BunRequest): Promise<string | null> {
  return req.headers.get("x-user-id")
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
