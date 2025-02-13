import getAccessToken from "./getAccessToken";
//import { useState, useEffect } from "react";

const PAGE_SIZE = 8;

// Function to get a list of games from IGDB API
export default async function getGames(query: string, page: number) {
    const access_token = await getAccessToken();
    //const [games, setGames] = useState([]);
    //const [page, setPage] = useState(1);
    //const [totalGames, setTotalGames] = useState(0);
    const offset = (page - 1) * PAGE_SIZE; //8 is page size
    //console.log(query);
    //const params = "fields name, cover.url, slug;"
    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${access_token}`
            },
            body: query.length > 0 
                ? `search "${query}"; fields name, cover.url, slug; limit ${PAGE_SIZE}; offset ${offset};`
                : `fields name, cover.url, slug; limit ${PAGE_SIZE}; offset ${offset};`
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status} ${response.statusText}`);
        }

        return response.json();

    } catch (error) {
        console.log(error.message);
        return [];
    }
}