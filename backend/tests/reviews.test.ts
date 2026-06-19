import { test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { startTestServer, resetDb, seedGame, seedLog } from "./helpers";

let server: ReturnType<typeof startTestServer>;
beforeAll(() => { server = startTestServer(); });
afterAll(() => { server.stop(); });
beforeEach(() => resetDb());

const url = (path: string) => `${server.url}${path}`;

type ReviewsResponse = {
  stats: { avg_rating: string | null; rating_count: string; total_reviews: string };
  reviews: unknown[];
  pagination: { limit: number; offset: number; total: number };
};

test("stats average the ratings and exclude null (text-only) ratings", async () => {
  await seedGame(1942);
  await seedLog(1942, 8);
  await seedLog(1942, 6);
  await seedLog(1942, 10);    // avg of 8,6,10 = 8.00
  await seedLog(1942, null);  // text-only: excluded from avg + rating_count, counted in total

  const res = await fetch(url("games/1942/reviews"));
  expect(res.status).toBe(200);
  const body = await res.json() as ReviewsResponse;

  expect(Number(body.stats.avg_rating)).toBeCloseTo(8);  // null rating doesn't drag it down
  expect(Number(body.stats.rating_count)).toBe(3);       // 3 actual ratings
  expect(Number(body.stats.total_reviews)).toBe(4);      // 4 rows total (incl. text-only)
  expect(body.reviews.length).toBe(4);                   // text-only review still appears in the list
  expect(body.pagination.total).toBe(4);
});

test("avg_rating is rounded to 2 decimals", async () => {
  await seedGame(1942);
  await seedLog(1942, 7);
  await seedLog(1942, 8);
  await seedLog(1942, 8);   // 23 / 3 = 7.666... -> 7.67

  const res = await fetch(url("games/1942/reviews"));
  const body = await res.json() as ReviewsResponse;
  // toBe(7.67) fails on the raw 7.6666..., so this genuinely checks the rounding
  expect(Number(body.stats.avg_rating)).toBe(7.67);
});

test("a game with no logs returns empty reviews and zeroed stats", async () => {
  await seedGame(1942);

  const res = await fetch(url("games/1942/reviews"));
  expect(res.status).toBe(200);
  const body = await res.json() as ReviewsResponse;

  expect(body.reviews).toEqual([]);
  expect(body.stats.avg_rating).toBeNull();           // AVG over no rows is NULL
  expect(Number(body.stats.rating_count)).toBe(0);
  expect(Number(body.stats.total_reviews)).toBe(0);
  expect(body.pagination.total).toBe(0);
});

test("pagination limits the page but stats stay over the full set", async () => {
  await seedGame(1942);
  for (let i = 0; i < 5; i++) await seedLog(1942, 8);

  const res = await fetch(url("games/1942/reviews?limit=2"));
  const body = await res.json() as ReviewsResponse;

  expect(body.reviews.length).toBe(2);                 // page is limited to 2
  expect(body.pagination.limit).toBe(2);
  expect(Number(body.stats.total_reviews)).toBe(5);    // stats run over the full set, not the page
  expect(body.pagination.total).toBe(5);
});

test("offset skips into the result set", async () => {
  await seedGame(1942);
  for (let i = 0; i < 5; i++) await seedLog(1942, 8);

  const res = await fetch(url("games/1942/reviews?limit=2&offset=4"));
  const body = await res.json() as ReviewsResponse;

  expect(body.reviews.length).toBe(1);                 // only the 5th row is left after skipping 4
  expect(body.pagination.offset).toBe(4);
});

test("limit is clamped to 100", async () => {
  await seedGame(1942);
  const res = await fetch(url("games/1942/reviews?limit=999"));
  const body = await res.json() as ReviewsResponse;
  expect(body.pagination.limit).toBe(100);
});
