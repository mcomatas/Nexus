import { db } from "./db";
import { userRoutes } from "./routes/users";
import { gameRoutes } from "./routes/games";
import { gameLogRoutes } from "./routes/gameLogs";
import { authRoutes } from "./routes/auth";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/health": () => new Response('OK'),
    ...userRoutes,
    ...gameRoutes,
    ...gameLogRoutes,
    ...authRoutes
  }
});

console.log(`Listening on ${server.url}`);
