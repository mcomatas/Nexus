import getAccessToken from "./getAccessToken";

export default async function getGameData(slug: string) {
    const access_token = await getAccessToken();
    //console.log(access_token);
    //console.log(slug);
    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${access_token}`
            },
            body: `
                fields cover.url, slug, name;
                where slug = "${slug}";
            `
        });

        if (!response.ok) {
            //console.log(response.body);
            throw new Error(`Response status: ${response.status}`);
        }

        //console.log(await response.json());
        return response.json();

    } catch(error) {
        console.log(error.message);
    }
}