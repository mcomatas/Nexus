import getAccessToken from "./getAccessToken";

// Function to get a list of games from IGDB API
export default async function getGames(query: string) {
    const access_token = await getAccessToken();
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
            body: query.length > 0 ? `search "${query}"; fields name, cover.url, slug;` : 'fields name, cover.url, slug; limit 8;'
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status} ${response.statusText}`);
        }

        return response.json();

    } catch (error) {
        console.log(error.message);
    }
}