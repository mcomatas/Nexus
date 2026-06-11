import { db } from '../db.ts';

const params = {
  "client_id": Bun.env.IGDB_CLIENT_ID,
  "client_secret": Bun.env.IGDB_CLIENT_SECRET,
  "grant_type": "client_credentials"
}

interface IgdbGameRaw {
  id: number;
  name: string; // title
  slug?: string;
  summary?: string; // description
  storyline?: string; // (fallback)
  cover?: { url: string }; // single object
  artworks?: { url: string }[]; // array - might not have any`
  first_release_date?: number; // unix Seconds -> release year
}

let cachedToken: string | null = null;
let expiresAt: number = 0; // Start at 0, nothing cached yet

// Function to get the access token from IGDB
export async function getAccessToken() {
  // If the token exists and hasn't expired, return it
  if (cachedToken && Date.now() < expiresAt) return cachedToken;

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "content-type": "application/json"
    }
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const data = await response.json() as { access_token: string; expires_in: number };

  cachedToken = data.access_token;
  // Date.now() in ms and expires_in is in seconds. The minus 60 gives a little leg room
  expiresAt = Date.now() + ((data.expires_in - 60) * 1000);
  return cachedToken;
}

// Function to search games on IGDB
export async function searchGamesFromIGDB(query: string | null, limit: number, offset: number) {
  const accessToken = await getAccessToken();

  // Protect against IGDB/Apicalypse injection. Replace " and \
  if (query) query = query.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  const body = `
    ${query ? `search "${query}";` : ""}
    fields name, slug, cover.url;
    where cover != null & game_type = (0,8) & version_parent = null;
    limit ${limit};
    offset ${offset};
    ${query ? "" : "sort total_rating_count desc;"}
  `

  const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": Bun.env.IGDB_CLIENT_ID!,
      Authorization: `Bearer ${accessToken}`,
    },
    body: body,
  });

  const gamesRaw = await gamesResponse.json() as {
    id: number;
    name: string;
    slug: string;
    cover: {
      url: string;
    } | null;
  }[];

  const games = gamesRaw.map((game) => {
    return {
      igdb_id: game.id,
      title: game.name,
      slug: game.slug ?? null,
      cover_url: game.cover
        ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
        : null,
    }
  });

  return games;
}

// Function to fetch a game from IGDB by its ID
export async function fetchGameFromIGDB(igdbId: number) {
  const accessToken = await getAccessToken();

  const response = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": Bun.env.IGDB_CLIENT_ID!,
      "Authorization": `Bearer ${accessToken}`,
    },
    body: `
      fields cover.url, slug, name, storyline, summary, artworks.url, first_release_date;
      where id = ${igdbId};
    `
  });

  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const [game] = await response.json() as IgdbGameRaw[];
  if (!game) return null // not on IGDB -> make it 404

  return {
    igdb_id: game.id,
    title: game.name,
    description: game.storyline ?? game.summary ?? null, // fallback chain
    cover_url: game.cover
      ? `https:${game.cover.url.replace("t_thumb", "t_cover_big")}`
      : null,
    artwork_url: game.artworks?.[0]
      ? `https:${game.artworks[0]?.url.replace("t_thumb", "t_1080p")}`
      : null,
    slug: game.slug ?? null,
    release_year: game.first_release_date
      ? new Date(game.first_release_date * 1000).getUTCFullYear()
      : null,
  }
}

// Function to see if game is cached in local DB, if not fetch and insert it
export async function ensureGameCached(igdbId: number) {
  const [row] = await db`
    SELECT igdb_id, title, description, cover_url, artwork_url, slug, release_year
    FROM games WHERE igdb_id = ${igdbId}
  `
  if (row) return row;

  const game = await fetchGameFromIGDB(igdbId);
  if (!game) return null;

  await db`
    INSERT INTO games (igdb_id, title, description, cover_url, artwork_url, slug, release_year)
    VALUES (${game.igdb_id}, ${game.title}, ${game.description}, ${game.cover_url}, ${game.artwork_url}, ${game.slug}, ${game.release_year})
    ON CONFLICT (igdb_id) DO NOTHING
  `;

  return game;
}
