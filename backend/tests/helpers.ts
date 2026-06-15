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
