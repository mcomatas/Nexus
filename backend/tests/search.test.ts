import { test, expect, beforeAll, afterAll, beforeEach, mock } from "bun:test";

// Spy that stands in for the real IGDB call. We assert on what the ROUTE passes
// to it (query/limit/offset) and that it returns the spy's result as JSON.
const searchSpy = mock(async (_query: string | null, _limit: number, _offset: number) => {
  return [{ igdb_id: 1, title: "Zelda", slug: "zelda", cover_url: "https://img/co.jpg" }];
});

// Replace the whole igdb module. Must provide every export the routes import,
// or those imports become undefined and unrelated route files break on load.
mock.module("../src/lib/igdb.ts", () => ({
  searchGamesFromIGDB: searchSpy,
  fetchGameFromIGDB: async () => null,
  ensureGameCached: async () => null,
}));

import { startTestServer, resetDb } from "./helpers";

let server: ReturnType<typeof startTestServer>;
beforeAll(() => { server = startTestServer(); });
afterAll(() => { server.stop(); });
beforeEach(() => { resetDb(); searchSpy.mockClear(); });

const url = (path: string) => `${server.url}${path}`;

test("returns the IGDB client's results as JSON", async () => {
  const res = await fetch(url("games/search?query=zelda"));
  expect(res.status).toBe(200);
  const body = await res.json() as { igdb_id: number; title: string }[];
  expect(body).toHaveLength(1);
  expect(body[0]?.title).toBe("Zelda");
});

test("passes the query string through to the IGDB client", async () => {
  await fetch(url("games/search?query=mario"));
  expect(searchSpy).toHaveBeenCalledTimes(1);
  const [query] = searchSpy.mock.calls[0]!;
  expect(query).toBe("mario");
});

test("missing query is passed as null (browse mode)", async () => {
  await fetch(url("games/search"));
  const [query] = searchSpy.mock.calls[0]!;
  expect(query).toBeNull();
});

test("clamps limit to IGDB's max of 500", async () => {
  await fetch(url("games/search?query=x&limit=999"));
  const [, limit] = searchSpy.mock.calls[0]!;
  expect(limit).toBe(500);
});

test("floors a negative offset to 0", async () => {
  await fetch(url("games/search?query=x&offset=-5"));
  const [, , offset] = searchSpy.mock.calls[0]!;
  expect(offset).toBe(0);
});
