import { NextResponse, NextRequest } from "next/server";
import getAccessToken from "../../../lib/getAccessToken";

export async function GET(request: NextRequest) {
  const ids = request.nextUrl.searchParams.get("ids");

  if (!ids) {
    return NextResponse.json({ error: "Missing ids parameter" }, { status: 400 });
  }

  const idArray = ids.split(",").filter((id) => parseInt(id) > 0);

  if (idArray.length === 0) {
    return NextResponse.json({ games: [] });
  }

  const accessToken = await getAccessToken();
  const body = `fields name, slug, cover.url; where id = (${idArray.join(",")}); limit ${idArray.length};`;

  const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
    body,
  });

  const games = await gamesResponse.json();

  return NextResponse.json({ games });
}
