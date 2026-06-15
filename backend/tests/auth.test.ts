import { test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { startTestServer, resetDb } from "./helpers";

let server: ReturnType<typeof startTestServer>;
beforeAll(() => { server = startTestServer(); });
afterAll(() => { server.stop(); });
beforeEach(() => resetDb());

const url = (path: string) => `${server.url}${path}`;

test("register creates a user and sets a session cookie", async () => {
  const res = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "a@test.com", username: "alex", password: "password123" }),
  });

  expect(res.status).toBe(201);
  const body = await res.json() as { email?: string; username?: string; password_hash?: string };
  expect(body.email).toBe("a@test.com");
  expect(body.password_hash).toBeUndefined();
  expect(res.headers.get("set-cookie")).toContain("session=");
});

test("register with a duplicate email", async () => {
  const res1 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "a@test.com", username: "alex", password: "password123" }),
  });
  const res2 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "a@test.com", username: "alex2", password: "password123" }),
  });

  // res1 checks. Same as test above. Does it need to be tested? I think so becuase what if it fails in this test specifically
  expect(res1.status).toBe(201);
  const body = await res1.json() as { email?: string; username?: string; password_hash?: string };
  expect(body.email).toBe("a@test.com");
  expect(body.password_hash).toBeUndefined();
  expect(res1.headers.get("set-cookie")).toContain("session=");

  // res2 checks, check you get the 409 conflict error code
  expect(res2.status).toBe(409);


})
