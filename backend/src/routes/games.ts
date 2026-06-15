import { db } from '../db.ts'
import { searchGamesFromIGDB, fetchGameFromIGDB, ensureGameCached } from '../lib/igdb.ts'

const PAGE_SIZE = 32;

export const gameRoutes = {
  "/games": {
    GET: async () => {
      try {
        const games = await db`SELECT igdb_id, title, slug, cover_url, artwork_url, description, release_year FROM games;`;
        return Response.json(games);
      } catch (err: any) {
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
    POST: async (req: Bun.BunRequest) => {
      try {
        const { igdb_id } = await req.json() as { igdb_id?: number };
        if (typeof igdb_id !== "number" || !Number.isInteger(igdb_id)) return Response.json({ error: "igdb_id (integer) required" }, { status: 400 });

        const game = await ensureGameCached(igdb_id)
        if (!game) return Response.json({ error: "Game not found on IGDB" }, { status: 404 });

        return Response.json(game, { status: 200 });

      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }

    }
  },
  // This endpoint is for searching on IGDB, not local DB
  "/games/search": {
    GET: async (req: Bun.BunRequest) => {
      try {
        const url = new URL(req.url);
        const query = url.searchParams.get("query") || null;
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || PAGE_SIZE, 1), 500);
        const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);

        const games = await searchGamesFromIGDB(query, limit, offset);

        return Response.json(games, { status: 200 });

      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    }
  },
  "/games/:id": {
    // Get a single cached game
    GET: async (req: Bun.BunRequest) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid id" }, { status: 400 });

        const [game] = await db`SELECT igdb_id, title, slug, cover_url, artwork_url, description, release_year FROM games WHERE igdb_id = ${Number(id)};`;

        if (!game) return Response.json({ error: "Game not found" }, { status: 404 });

        return Response.json(game);
      } catch (err: any) {
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
    // Re-sync a game's cached data from IGDB
    /*PATCH: async (req: Bun.BunRequest) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid id" }, { status: 400 });

        const game = await fetchGameFromIGDB(id);
        if (!game) return Response.json({ error: "Game not found on IGDB" }, { status: 404 });

        const [row] = await db`
          UPDATE games
          SET title = ${game.title},
              description = ${game.description},
              cover_url = ${game.cover_url},
              artwork_url = ${game.artwork_url},
              slug = ${game.slug},
              release_year = ${game.release_year},
              updated_at = NOW()
          WHERE igdb_id = ${id}
          RETURNING igdb_id, title, slug, cover_url, artwork_url, description, release_year;
        `;

        if (!row) return Response.json({ error: "Game not found" }, { status: 404 });
        return Response.json(row, { status: 200 });

      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    },
    // Remove a cached game
    DELETE: async (req: Bun.BunRequest) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid id" }, { status: 400 });

        const [game] = await db`
          DELETE FROM games where igdb_id = ${id} RETURNING igdb_id
        `
        if (!game) return Response.json({ error: "Game not found" }, { status: 404 });
        return new Response(null, { status: 204 });

      } catch (err: any) {
        if (err.code === "23503") return Response.json({ error: "Game has logs, can't delete" }, { status: 409 });
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
      }*/
  },
  "/games/:id/reviews": {
    GET: async (req: Bun.BunRequest) => {
      try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid id" }, { status: 400 });

        const url = new URL(req.url);
        const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 100);
        const offset = Math.max(Number(url.searchParams.get("offset")) || 0, 0);

        const reviews = await db`
          SELECT * FROM game_logs
          WHERE igdb_id = ${id}
          ORDER BY created_at DESC
          LIMIT ${limit} OFFSET ${offset}
        `;
        const [stats] = await db`
          SELECT
            AVG(rating)::numeric(4,2) AS avg_rating,
            COUNT(rating)             AS rating_count,
            COUNT(*)                  AS total_reviews
          FROM game_logs WHERE igdb_id = ${id}
        `;

        return Response.json({
          stats,
          reviews,
          pagination: { limit, offset, total: Number(stats.total_reviews) }
        }, { status: 200 });
      } catch (err: any) {
        console.error(err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    }
  }
};
