import { db } from '../db.ts';
import { createSession } from "../lib/auth.ts";

export const authRoutes = {
  "/auth/register": {
    POST: async (req: Bun.BunRequest) => {
      try {
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
        const invalid = () => Response.json({ error: "Invalid email or password" }, { status: 401 });

        const { email, password } = await req.json() as { email?: string, password?: string }
        if (!email || !password) {
          return Response.json({ error: "Missing email or password" }, { status: 400 });
        }
        if (typeof email === "string" && !email.includes("@")) {
          return Response.json({ error: "Invalid email" }, { status: 400 });
        }

        const [user] = await db`
          SELECT id, email, username FROM users
          WHERE email = ${email}
        `;
        if (!user) return invalid();
        const [account] = await db`
          SELECT id, user_id, password_hash FROM accounts
          WHERE user_id = ${user.id} AND provider = 'password'
        `;
        if (!account) return invalid();

        const verified = await Bun.password.verify(password, account.password_hash);
        if (!verified) return invalid();

        const session = await createSession(user.id);
        const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
        const cookie = `session=${session.id}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax; Secure`

        return Response.json(user, {
          status: 200,
          headers: { "Set-Cookie": cookie }
        });
      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
  },

  "/auth/logout": {
    POST: async (req: Bun.BunRequest) => {
      try {
        const cookies = req.cookies;
        const sessionCookie = cookies.get("session");

        if (sessionCookie) {
          await db`DELETE FROM sessions WHERE id = ${sessionCookie}`
        }
        const clearCookie = `session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`;

        return new Response(null, { status: 204, headers: { "Set-Cookie": clearCookie } });

      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
  },
};
