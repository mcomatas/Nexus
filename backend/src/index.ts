import { db } from "./db";
import { userRoutes } from "./routes/users";
import { gameRoutes } from "./routes/games";
import { gameLogRoutes } from "./routes/gameLogs";
import { authRoutes } from "./routes/auth";

export const routes = { ...userRoutes, ...gameRoutes, ...gameLogRoutes, ...authRoutes };

console.log("index.ts ran");

if (import.meta.main) {
  const server = Bun.serve({
    port: 3000,
    routes: { "/health": () => new Response('OK'), ...routes }
  });

  console.log(`Listening on ${server.url}`);
}
