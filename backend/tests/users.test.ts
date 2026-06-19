import { test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { startTestServer, resetDb, registerUser } from "./helpers";

let server: ReturnType<typeof startTestServer>;
beforeAll(() => { server = startTestServer(); });
afterAll(() => { server.stop(); });
beforeEach(() => resetDb());

const url = (path: string) => `${server.url}${path}`;

// Register user and then get user via /users/:id. Make sure email doesn't leak
test("Get user by id doesn't leak email", async () => {
  const { id } = await registerUser(server.url, "m@test", "mike");
  const res = await fetch(url(`users/${id}`));
  const body = await res.json() as { id: string; email: string; username: string };
  expect(res.status).toBe(200);
  expect(body.email).toBeUndefined();
  expect(body.username).toBe("mike");
  expect(body.id).toBe(id);
})
