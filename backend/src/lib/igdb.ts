const params = {
  "client_id": process.env.IGDB_CLIENT_ID,
  "client_secret": process.env.IGDB_CLIENT_SECRET,
  "grant_type": "client_credentials"
}

let cachedToken: string | null = null;
let expiresAt: number = 0; // Start at 0, nothing cached yet

export default async function getAccessToken() {
  // If the token exists and hasn't expired, return it
  if (cachedToken && Date.now() < expiresAt) return cachedToken;

  const response = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      'content-type': 'application/json'
    }
  });
  if (!response.ok) throw new Error(`Response status: ${response.status}`);

  const data = await response.json() as { access_token: string; expires_in: number };

  cachedToken = data.access_token;
  // Date.now() in ms and expires_in is in seconds. The minus 60 gives a little leg room
  expiresAt = Date.now() + ((data.expires_in - 60) * 1000);
  return cachedToken;
}
