// Function to get the bearer access token
const params = {
    'client_id': process.env.IGDB_CLIENT_ID,
    'client_secret': process.env.IGDB_CLIENT_SECRET,
    'grant_type': 'client_credentials'
}

export default async function getAccessToken() {
    try {
        const response = await fetch("https://id.twitch.tv/oauth2/token", {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                'content-type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();
        return data.access_token;

    } catch (error) {
        console.log(error.message);
    }
}