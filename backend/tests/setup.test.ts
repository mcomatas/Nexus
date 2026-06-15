import { test, expect } from "bun:test";

test("tests use the test database", () => {
  expect(Bun.env.DATABASE_URL).toContain("nexus_test");
});
