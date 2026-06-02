import { db } from '../db.ts'

export const userRoutes = {
  "/users": {
    GET: async () => {
      const users = await db`SELECT id, email, username, created_at FROM users;`;
      return Response.json(users);
    },
    POST: async(req: Bun.BunRequest) => {
      try {
        const { email, username } = await req.json() as { email?: string; username?: string };
        if (!email || !username) return Response.json({ error: "email and username required" }, { status: 400 });
        if (typeof email === "string" && !email.includes("@")) {
          return Response.json({ error: "Invalid email" }, { status: 400 });
        }

        const [user] = await db`
          INSERT INTO users (email, username)
          VALUES (${email}, ${username})
          RETURNING id, email, username, created_at
        `;

        return Response.json(user, { status: 201 });
      } catch (err: any) {
        if (err.code === "23505") {
          return Response.json({ error: "User already exists" }, { status: 409 });
        }
        return Response.json({ error: "Bad request" }, { status: 400 });
      }
    }
  },
  "/users/:id": {
    GET: async (req: Bun.BunRequest) => {
      try {
        const { id } = req.params;
        const [user] = await db`SELECT id, email, username, created_at FROM users WHERE id = ${id};`;
        if (!user) return Response.json({ error: "User not found" }, { status: 404 });
        return Response.json(user);
      } catch (err: any) {
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
    PATCH: async (req: Bun.BunRequest) => {
      try {
        const { id } = req.params;
        const { email, username } = await req.json() as { email?: string; username?: string };
        if (!email && !username) return Response.json({ error: "email or username required"}, { status: 400 });
        if (typeof email === "string" && !email.includes("@")) {
          return Response.json({ error: "Invalid email" }, { status: 400 });
        }

        const [user] = await db`
          UPDATE users
          SET email      = COALESCE(${email ?? null}, email),
              username   = COALESCE(${username ?? null}, username),
              updated_at = NOW()
          WHERE id = ${id}
          RETURNING id, email, username, created_at, updated_at
        `;
        if (!user) return Response.json({ error: "User not found" }, { status: 404 });
        return Response.json(user);
      } catch (err: any) {
        if (err.code === "23505") {
          return Response.json({ error: "User already exists" }, { status: 409 });
        }
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
    DELETE: async (req: Bun.BunRequest) => {
      try {
        const { id } = req.params;
        const [user] = await db`
          DELETE FROM users WHERE id = ${id} RETURNING id
        `
        if (!user) return Response.json({ error: "User not found" }, { status: 404 });
        return new Response(null, { status: 204 });
      } catch (err: any) {
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    }
  }
};
