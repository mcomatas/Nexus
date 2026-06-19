import { test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { startTestServer, resetDb, seedGame } from "./helpers";

let server: ReturnType<typeof startTestServer>;
beforeAll(() => { server = startTestServer(); });
afterAll(() => { server.stop(); });
beforeEach(() => resetDb());

const url = (path: string) => `${server.url}${path}`;

test("GET /games returns all cached games", async () => {
  await seedGame(1942, { title: "Witcher 3", slug: "witcher-3" });
  await seedGame(1020, { title: "GTA V", slug: "gta-v" });

  const res = await fetch(url("games"));
  expect(res.status).toBe(200);
  const games = await res.json() as { igdb_id: number }[];
  expect(games).toHaveLength(2);
  expect(games.map(g => g.igdb_id).sort()).toEqual([1020, 1942]);
});

test("GET /games returns an empty array when nothing is cached", async () => {
  const res = await fetch(url("games"));
  expect(res.status).toBe(200);
  expect(await res.json()).toEqual([]);
});

test("GET /games/:id returns the cached game", async () => {
  await seedGame(1942, { title: "Witcher 3", slug: "witcher-3" });

  const res = await fetch(url("games/1942"));
  expect(res.status).toBe(200);
  const game = await res.json() as { igdb_id: number; title: string };
  expect(game.igdb_id).toBe(1942);
  expect(game.title).toBe("Witcher 3");
});

test("GET /games/:id returns 404 when the game isn't cached", async () => {
  const res = await fetch(url("games/9999"));
  expect(res.status).toBe(404);
  expect(await res.json()).toEqual({ error: "Game not found" });
});

test("GET /games/:id rejects a non-numeric id", async () => {
  const res = await fetch(url("games/abc"));
  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "Invalid id" });
});

test("POST /games returns an already-cached game (no IGDB call)", async () => {
  await seedGame(1942, { title: "Witcher 3", slug: "witcher-3" });

  const res = await fetch(url("games"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ igdb_id: 1942 }),
  });
  expect(res.status).toBe(200);
  expect((await res.json() as { igdb_id: number }).igdb_id).toBe(1942);
});

test("POST /games rejects a missing/invalid igdb_id", async () => {
  const res = await fetch(url("games"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "igdb_id (integer) required" });
});
