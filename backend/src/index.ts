import { db } from "./db";
import { userRoutes } from "./routes/users";
import { gameRoutes } from "./routes/games";
import { gameLogRoutes } from "./routes/gameLogs";
import { authRoutes } from "./routes/auth";
import { withCors } from "./lib/cors";

export const routes = { ...userRoutes, ...gameRoutes, ...gameLogRoutes, ...authRoutes };

if (import.meta.main) {
  const server = Bun.serve({
    port: 3000,
    routes: { "/health": () => new Response('OK'), ...withCors(routes) }
  });

  console.log(`Listening on ${server.url}`);
}
