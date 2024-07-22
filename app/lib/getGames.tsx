import getAccessToken from "./getAccessToken";

// Function to get a list of games from IGDB API
export default async function getGames() {
    const access_token = await getAccessToken();
    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${access_token}`
            },
            body: "fields cover.url, slug; limit 10;"
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return response.json();

    } catch (error) {
        console.log(error.message);
    }
}