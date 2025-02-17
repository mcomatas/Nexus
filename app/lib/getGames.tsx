import getAccessToken from "./getAccessToken";
//import { useState, useEffect } from "react";

export const PAGE_SIZE = 16;

type GamesResponse = {
    games: any[];
    count: number;
}

// Function to get a list of games from IGDB API
export default async function getGames(query: string, page: number): Promise<GamesResponse> {
    const access_token = await getAccessToken();
    const offset = (page - 1) * PAGE_SIZE;
    const body = query.length > 0 
                ? `search "${query}"; fields name, cover.url, slug; limit ${PAGE_SIZE}; offset ${offset}; where rating > 0;`
                : `fields name, cover.url, slug; limit ${PAGE_SIZE}; offset ${offset}; where rating > 0;`

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