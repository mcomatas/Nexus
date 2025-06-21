import { NextResponse, NextRequest } from 'next/server'
import getAccessToken from '../../lib/getAccessToken';


const PAGE_SIZE = 32;
//type Params = { query: string, page: number }
type GamesResponse = {
    games: any[];
    count: number;
}

export async function GET(request: NextRequest) {
    const accessToken = await getAccessToken();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");
    const page = parseInt(searchParams.get("page")) || 1;
    const offset = (page - 1) * PAGE_SIZE;
    //console.log("Query: ", query);
    //console.log("Page: ", page);
    const bodyMain = `fields name, slug, cover.url; where cover != null & game_type = (0,8) & version_parent = null; limit ${PAGE_SIZE}; offset ${offset};`
    const body = query.length > 0
                ? `search "${query}"; ${bodyMain}`
                : `${bodyMain} sort total_rating_count desc;`;

    const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Client-ID': process.env.IGDB_CLIENT_ID,
            'Authorization': `Bearer ${accessToken}`
        },
        //body: req.body
        body: body
    });

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

    const count = await countResponse.json();
    
    return NextResponse.json({games, count});
}

//export async function POST(req: NextRequest) {
    /*const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const offset = (page - 1) * PAGE_SIZE;*/
    
    //const response = await req.json();

    // This is what I used for a hard coded body before response.body
    /*const bodyMain = `fields name, slug, cover.url; where cover != null & game_type = (0,8); limit ${PAGE_SIZE}; offset ${offset};`
    const body = query.length > 0 
                ? `search "${query}"; ${bodyMain}`
                : `${bodyMain} sort total_rating_count desc;`;*/

    //const accessToken = await getAccessToken();

    //return NextResponse.json({ message: "This is a test response" });
    
    /*try {
        const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            },
            body: response.body
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
            body: response.body
        });

        const { count } = await countResponse.json();
        return NextResponse.json({ games, count })

    } catch (error) {
        console.log(error.message);
        return NextResponse.json(error);
    }*/
//}