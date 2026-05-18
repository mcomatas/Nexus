import { db } from "./db";
import { userRoutes } from "./routes/users";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/health": () => new Response('OK'),
    ...userRoutes
  }
});

console.log(`Listening on ${server.url}`);
