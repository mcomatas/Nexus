import { routes } from "../src/index.ts";
import { db } from "../src/db.ts"

export function startTestServer() {
  // port 0 = OS picks a free port, it does not clash with dev server on 3000
  return Bun.serve({ port: 0, routes });
}

export async function resetDb() {
  // CASCADE handles FK order, clears everything so each test starts clean
  if (!Bun.env.DATABASE_URL?.includes("test")) {
    throw new Error(`resetDb refused: DATABASE_URL is not a test DB (${Bun.env.DATABASE_URL})`);
  }
  await db`TRUNCATE users, accounts, game_logs, sessions, games RESTART IDENTITY CASCADE`
}

// Seed a cached game directly, so POST /game-logs (via ensureGameCached) finds it
// in the DB and never calls IGDB. title/slug just need to be present + unique.
export async function seedGame(igdbId: number, overrides: { title?: string; slug?: string } = {}) {
  const [game] = await db`
    INSERT INTO games (igdb_id, title, slug)
    VALUES (${igdbId}, ${overrides.title ?? `Game ${igdbId}`}, ${overrides.slug ?? `game-${igdbId}`})
    RETURNING igdb_id, title, slug
  `;
  return game;
}

// Setup helper: register a user and return their session cookie + id.
// Assertion-free on purpose — it's setup, not a test. The dedicated register
// tests own the assertions about register's behavior.
export async function registerUser(base: string | URL, email: string, username: string) {
  const res = await fetch(`${base}auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password: "password123" }),
  });
  const cookie = res.headers.get("set-cookie")?.split(";")[0] ?? ""; // "session=<token>"
  const body = await res.json() as { id: string };
  return { cookie, id: body.id };
}
