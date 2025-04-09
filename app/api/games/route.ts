import { NextResponse, NextRequest } from 'next/server'
import getAccessToken from '../../lib/getAccessToken';


const PAGE_SIZE = 32;
//type Params = { query: string, page: number }
type GamesResponse = {
    games: any[];
    count: number;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const offset = (page - 1) * PAGE_SIZE;
    const bodyMain = `fields name, slug, cover.url; where cover != null & game_type = (0,8); limit ${PAGE_SIZE}; offset ${offset};`
    const body = query.length > 0 
                ? `search "${query}"; ${bodyMain}`
                : `${bodyMain} sort total_rating_count desc;`;

    const accessToken = await getAccessToken();
    
    try {
        const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            },
            body: body
        });

        if (!gamesResponse.ok) {
            throw new Error(`gamesResponse status: ${gamesResponse.status} ${gamesResponse.statusText}`);
        }

        const games = await gamesResponse.json();

        const countResponse = await fetch("https://api.igdb.com/v4/games/count", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            },
            body: body
        });

        const { count } = await countResponse.json();
        return NextResponse.json({ games, count })

    } catch (error) {
        console.log(error.message);
        return NextResponse.json(error);
    }
}