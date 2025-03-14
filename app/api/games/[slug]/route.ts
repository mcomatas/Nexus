import { NextResponse } from "next/server";
import getAccessToken from "../../../lib/getAccessToken";

export async function GET(response: NextResponse, { params }) {
    const slug = params.slug;

    const accessToken = await getAccessToken();

    try {
        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`,
                'Access-Control-Allow-Origin': '*'
            },
            body: `
                fields cover.url, slug, name, storyline, summary, artworks.url;
                where slug = "${slug}";
            `
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        //console.log(await response.json());
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.log(error.message);
    }

    //return NextResponse.json({ message: `Hello from ${slug}`, status: 200 })
    //return new Response(`Hello from ${slug}`)
}