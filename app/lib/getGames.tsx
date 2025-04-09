import getAccessToken from "./getAccessToken";
//import { useState, useEffect } from "react";

export const PAGE_SIZE = 32;

type GamesResponse = {
    games: any[];
    count: number;
}

// Function to get a list of games from IGDB API
export default async function getGames(query: string, page: number): Promise<GamesResponse> {
    const access_token = await getAccessToken();
    const offset = (page - 1) * PAGE_SIZE;
    const bodyMain = `fields name, slug, cover.url; where cover != null & game_type = (0,8); limit ${PAGE_SIZE}; offset ${offset};`
    const body = query.length > 0 
                ? `search "${query}"; ${bodyMain}`
                : `${bodyMain} sort total_rating_count desc;`;
    //console.log(body);
    try {
        const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${access_token}`
            },
            body: body
        });

        if (!gamesResponse.ok) {
            throw new Error(`gamesResponse status: ${gamesResponse.status} ${gamesResponse.statusText}`);
        }

        const games = await gamesResponse.json();
        //return gamesResponse.json();

        const countResponse = await fetch("https://api.igdb.com/v4/games/count", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${access_token}`
            },
            body: body
        });

        const { count } = await countResponse.json();

        //console.log(games, count);
        return { games, count };

    } catch (error) {
        console.log(error.message);
        return { games: [], count: 0 };
    }
}