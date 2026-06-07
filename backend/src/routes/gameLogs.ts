import { db } from '../db.ts';
import { ensureGameCached } from '../lib/igdb.ts';
import { getUserId } from '../lib/auth.ts';

export const gameLogRoutes = {
  "/game-logs": {
    // User centric look up. Game reviews in /games/:id/reviews
    GET: async (req: Bun.BunRequest) => {
      try {
        const url = new URL(req.url);
        const igdbIdRaw = url.searchParams.get("igdb_id"); // string | null
        const userId = url.searchParams.get("user_id"); // string | null

        if (!userId) return Response.json({ error: "user_id required" }, { status: 400 });

        let igdbId: number | null = null;
        if (igdbIdRaw !== null) {
          igdbId = Number(igdbIdRaw);
          if (!Number.isInteger(igdbId) || igdbId < 1) {
            return Response.json({ error: "Invalid IGDB id" }, { status: 400 });
          }
        }

        const logs = igdbId !== null
          ? await db`SELECT * FROM game_logs WHERE user_id = ${userId} AND igdb_id = ${igdbId}`
          : await db`SELECT * FROM game_logs WHERE user_id = ${userId}`;
        return Response.json(logs, { status: 200 })
      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
    POST: async (req: Bun.BunRequest) => {
      try {
        // Will need to update later when session is included. User ID fine for now.
        const user_id = await getUserId(req);
        if (!user_id) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const {
          igdb_id,
          rating,
          review_text
        } = await req.json() as {
            igdb_id?: number,
            rating?: number,
            review_text?: string
          };

        if (typeof igdb_id !== "number" || !Number.isInteger(igdb_id)) return Response.json({ error: "igdb_id (integer) required" }, { status: 400 });
        if (rating != null && (typeof rating !== "number" || rating < 1 || rating > 10)) {
          return Response.json({ error: "Rating must be 1-10" }, { status: 400 });
        }

        const game = await ensureGameCached(igdb_id);
        if (!game) return Response.json({ error: "Game not found on IGDB" }, { status: 404 });

        const [log] = await db`
          INSERT INTO game_logs (user_id, igdb_id, rating, review_text)
          VALUES (${user_id}, ${igdb_id}, ${rating || null}, ${review_text})
          ON CONFLICT (user_id, igdb_id)
          DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, updated_at = NOW()
          RETURNING id, user_id, igdb_id, rating, review_text, created_at, updated_at
        `

        return Response.json(log, { status: 201 });

      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
    DELETE: async (req: Bun.BunRequest) => {
      try {
        // Will need toupdate getUserId
        const user_id = await getUserId(req);
        if (!user_id) return Response.json({ error: "Unauthorized" }, { status: 401 });

        const { igdb_id } = await req.json() as { igdb_id?: number };
        if (typeof igdb_id !== "number" || !Number.isInteger(igdb_id)) return Response.json({ error: "igdb_id (integer) required" }, { status: 400 });

        const [row] = await db`
          DELETE FROM game_logs
          WHERE user_id = ${user_id} AND igdb_id = ${igdb_id}
          RETURNING id;
        `;

        if (!row) return Response.json({ error: "Log not found" }, { status: 404 });
        return new Response(null, { status: 204 });
      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    }
  }
}
