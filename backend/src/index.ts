import { db } from "./db";
import { userRoutes } from "./routes/users";
import { gameRoutes } from "./routes/games";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/health": () => new Response('OK'),
    ...userRoutes,
    ...gameRoutes
  }
});

console.log(`Listening on ${server.url}`);
