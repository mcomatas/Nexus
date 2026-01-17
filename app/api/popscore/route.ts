import { NextResponse, NextRequest } from "next/server";
import getAccessToken from "../../lib/getAccessToken";

// Fetch from popularity_primitives. The top games based on IGDB visits.
export async function GET(request: NextRequest) {
  const accessToken = await getAccessToken();

  const body =
    "fields game_id,value,popularity_type; sort value desc; limit 10; where popularity_type = 1;";

  const popResponse = await fetch(
    "https://api.igdb.com/v4/popularity_primitives",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": process.env.IGDB_CLIENT_ID,
        Authorization: `Bearer ${accessToken}`,
      },
      body: body,
    },
  );

  const popularity = await popResponse.json();
  const gameIds = popularity.map((item) => item.game_id);
  //console.log(gameIds);
  //console.log(gameIds.join(","));

  const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body: `fields name,slug,cover.url; where id = (${gameIds});`,
  });

  const games = await gamesResponse.json();

  return NextResponse.json(games);
}
