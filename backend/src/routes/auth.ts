import { db } from '../db.ts';
import { createSession } from "../lib/auth.ts";

export const authRoutes = {
  "/auth/register": {
    POST: async (req: Bun.BunRequest) => {
      try {
        // TODO: parse { email, username, password }; validate;
        // hash password with Bun.password.hash();
        // in a transaction (db.begin) insert users row + accounts row
        // (provider='password', password_hash); return the user WITHOUT the hash.

        const { email, username, password } = await req.json() as { email?: string, username?: string, password?: string }
        if (!email || !username || !password) {
          return Response.json({ error: "Missing email, username, or password" }, { status: 400 });
        }
        if (typeof email === "string" && !email.includes("@")) {
          return Response.json({ error: "Invalid email" }, { status: 400 });
        }
        if (password.length < 8) return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });

        const hashedPassword = await Bun.password.hash(password);

        const user = await db.begin(async (tx) => {
          const [user] = await tx`
            INSERT INTO users (email, username)
            VALUES (${email}, ${username})
            RETURNING id, email, username
          `;
          await tx`
            INSERT INTO accounts (user_id, provider, password_hash)
            VALUES (${user.id}, 'password', ${hashedPassword})
          `;
          return user;
        });

        const session = await createSession(user.id);
        const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
        const cookie = `session=${session.id}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`

        return Response.json(user, {
          status: 201,
          headers: { "Set-Cookie": cookie }
        });
      } catch (err: any) {
        if (err.code === "23505") {
          return Response.json({ error: "User already exists" }, { status: 409 });
        }
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
  },

  "/auth/login": {
    POST: async (req: Bun.BunRequest) => {
      try {
        // TODO: parse { email, password }; look up user + their 'password' account;
        // Bun.password.verify() against password_hash;
        // on success create a session + set the session cookie; return user (no hash).
        return new Response("Not implemented", { status: 501 });
      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
  },

  "/auth/logout": {
    POST: async (req: Bun.BunRequest) => {
      try {
        // TODO: read session token from the cookie; delete that session row;
        // clear the cookie; return 204.
        return new Response("Not implemented", { status: 501 });
      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
  },
};
