import { test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { startTestServer, resetDb, seedGame, registerUser } from "./helpers";

let server: ReturnType<typeof startTestServer>;
beforeAll(() => { server = startTestServer(); });
afterAll(() => { server.stop(); });
beforeEach(() => resetDb());

const url = (path: string) => `${server.url}${path}`;

function postLog(cookie: string, body: object) {
  return fetch(url("game-logs"), {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify(body),
  });
}

test("create a game log", async () => {
  const { cookie } = await registerUser(server.url, "m@test.com", "mike");
  await seedGame(1942); // seeded -> ensureGameCached hits cache, no IGDB

  const res = await postLog(cookie, { igdb_id: 1942, rating: 9, review_text: "great" });

  expect(res.status).toBe(201);
  const log = await res.json() as { igdb_id?: number; rating?: number; review_text?: string };
  expect(log.igdb_id).toBe(1942);
  expect(Number(log.rating)).toBe(9);          // numeric column may come back as a string
  expect(log.review_text).toBe("great");
});

test("re-submitting the same game upserts (updates, no duplicate row)", async () => {
  const { cookie, id } = await registerUser(server.url, "m@test.com", "mike");
  await seedGame(1942);

  await postLog(cookie, { igdb_id: 1942, rating: 5 });
  const second = await postLog(cookie, { igdb_id: 1942, rating: 8 });

  expect(second.status).toBe(201);
  expect(Number((await second.json() as { rating?: number }).rating)).toBe(8); // updated

  // and there's still only ONE log for this user+game
  const logs = await (await fetch(url(`game-logs?user_id=${id}`))).json() as unknown[];
  expect(logs.length).toBe(1);
});

test("rating outside 1-10 is rejected", async () => {
  const { cookie } = await registerUser(server.url, "m@test.com", "mike");
  await seedGame(1942);

  const res = await postLog(cookie, { igdb_id: 1942, rating: 11 });
  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "Rating must be 1-10" });
});

test("POST without a cookie is rejected", async () => {
  await seedGame(1942);
  const res = await fetch(url("game-logs"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ igdb_id: 1942, rating: 8 }),
  });
  expect(res.status).toBe(401);
});

test("DELETE without a cookie is rejected", async () => {
  const res = await fetch(url("game-logs"), {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ igdb_id: 1942 }),
  });
  expect(res.status).toBe(401);
  expect(await res.json()).toEqual({ error: "Unauthorized" });
});

test("delete own log, then 404 on second delete", async () => {
  const { cookie } = await registerUser(server.url, "m@test.com", "mike");
  await seedGame(1942);
  await postLog(cookie, { igdb_id: 1942, rating: 7 });

  const del = await fetch(url("game-logs"), {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ igdb_id: 1942 }),
  });
  expect(del.status).toBe(204);

  // nothing left to delete -> 404
  const del2 = await fetch(url("game-logs"), {
    method: "DELETE",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ igdb_id: 1942 }),
  });
  expect(del2.status).toBe(404);
});

test("GET /game-logs?user_id returns that user's logs", async () => {
  const { cookie, id } = await registerUser(server.url, "m@test.com", "mike");
  await seedGame(1942);
  await seedGame(1020);
  await postLog(cookie, { igdb_id: 1942, rating: 8 });
  await postLog(cookie, { igdb_id: 1020, rating: 6 });

  const res = await fetch(url(`game-logs?user_id=${id}`));
  expect(res.status).toBe(200);
  expect((await res.json() as unknown[]).length).toBe(2);
});

test("GET /game-logs without user-id returns 400", async () => {
  const res = await fetch(url("game-logs"));
  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "user_id required" });

  const res2 = await fetch(url("game-logs?igdb_id=1942"));
  expect(res2.status).toBe(400);
  expect(await res2.json()).toEqual({ error: "user_id required" });
})
