import { test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { startTestServer, resetDb } from "./helpers";

let server: ReturnType<typeof startTestServer>;
beforeAll(() => { server = startTestServer(); });
afterAll(() => { server.stop(); });
beforeEach(() => resetDb());

const url = (path: string) => `${server.url}${path}`;

// REGISTER TESTS
test("register creates a user and sets a session cookie", async () => {
  const res = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mike", password: "password123" }),
  });

  expect(res.status).toBe(201);
  const body = await res.json() as { email?: string; username?: string; password_hash?: string };
  expect(body.email).toBe("m@test.com");
  expect(body.password_hash).toBeUndefined();
  expect(res.headers.get("set-cookie")).toContain("session=");
});

test("register with a duplicate email", async () => {
  const res1 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mike", password: "password123" }),
  });
  const res2 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mikec", password: "password123" }),
  });

  // res1 check. Make sure the first user is created successfully
  expect(res1.status).toBe(201);

  // res2 checks, check you get the 409 conflict error code
  expect(res2.status).toBe(409);
  expect(await res2.json()).toEqual({ error: "User already exists" });

});

test("Missing email", async () => {
  const res = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: "mike", password: "password123" }),
  });

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "Missing email, username, or password" });
});

test("Missing username", async () => {
  const res = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", password: "password123" }),
  });

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "Missing email, username, or password" });
});

test("Missing password", async () => {
  const res = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mike" }),
  });

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "Missing email, username, or password" });
});

test("Password under 8 characters", async () => {
  const res = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mike", password: "pass" }),
  });

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "Password must be at least 8 characters" });
});

test("Email with no @", async () => {
  const res = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "mtest.com", username: "mike", password: "password123" }),
  });

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "Invalid email" });
});

test("Duplicate username", async () => {
  const res1 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mike", password: "password123" }),
  });

  expect(res1.status).toBe(201);

  const res2 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "mike@test.com", username: "mike", password: "password123" }),
  });

  expect(res2.status).toBe(409);
  expect(await res2.json()).toEqual({ error: "User already exists" });
});


// LOGIN TESTS
test("Correct login credentials", async () => {
  const res1 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mike", password: "password123" }),
  });

  expect(res1.status).toBe(201);

  const res2 = await fetch(url("auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", password: "password123" }),
  });

  expect(res2.status).toBe(200);
  expect(res2.headers.get("set-cookie")).toContain("session=");

});

test("Wrong password", async () => {
  const res1 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mike", password: "password123" }),
  });

  expect(res1.status).toBe(201);

  const res2 = await fetch(url("auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", password: "wrongpassword" }),
  });

  expect(res2.status).toBe(401);
  expect(await res2.json()).toEqual({ error: "Invalid email or password" });

});

test("Nonexistent email", async () => {
  const res = await fetch(url("auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "thisemail@doesntexist.com", password: "password123" }),
  });

  expect(res.status).toBe(401);
  expect(await res.json()).toEqual({ error: "Invalid email or password" });

});

test("Missing fields", async () => {
  const res = await fetch(url("auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: "password123" }),
  });

  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({ error: "Missing email or password" });

  const res2 = await fetch(url("auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com" }),
  });

  expect(res2.status).toBe(400);
  expect(await res2.json()).toEqual({ error: "Missing email or password" });
});

// LOGOUT TESTS
test("Logout with cookie", async () => {
  const res1 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mike", password: "password123" }),
  });
  expect(res1.status).toBe(201);

  const cookieHeader = res1.headers.get("set-cookie");
  const session = cookieHeader?.split(";")[0]?.split("=")[1];

  const cookie = `session=${session};`

  const res2 = await fetch(url("auth/logout"), {
    method: "POST",
    headers: { "Cookie": cookie },
  });

  expect(res2.status).toBe(204);
  expect(res2.headers.get("Set-Cookie")).toContain("session=;");
  expect(res2.headers.get("Set-Cookie")).toContain("Max-Age=0;");

});

test("Session expires on logout", async () => {
  const res1 = await fetch(url("auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "m@test.com", username: "mike", password: "password123" }),
  });
  expect(res1.status).toBe(201);

  const cookieHeader = res1.headers.get("set-cookie");
  const session = cookieHeader?.split(";")[0]?.split("=")[1];
  const cookie = `session=${session};`

  const res2 = await fetch(url("auth/logout"), {
    method: "POST",
    headers: { "Cookie": cookie },
  });
  expect(res2.status).toBe(204);

  const res3 = await fetch(url("game-logs"), {
    method: "POST",
    headers: { "Cookie": cookie },
    body: JSON.stringify({  }),
  });
  expect(res3.status).toBe(401);
  expect(await res3.json()).toEqual({ error: "Unauthorized" });
});

test("Logout with no cookie", async () => {
  const res = await fetch(url("auth/logout"), {
    method: "POST",
  });
  expect(res.status).toBe(204);
});
