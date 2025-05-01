import { NextResponse, NextRequest } from "next/server";
import getAccessToken from "../../../lib/getAccessToken";

type Params = { slug: string }

export async function GET(request: NextRequest, segmentData: { params: Params }) {
    const params = await segmentData.params;
    const slug = params.slug;

    const accessToken = await getAccessToken();

    try {
        const gameResponse = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`,
                'Access-Control-Allow-Origin': '*'
            },
            body: `
                fields cover.url, slug, name, storyline, summary, artworks.url, involved_companies.company.name, involved_companies.developer, involved_companies.publisher;
                where slug = "${slug}";
            `
        });

        if (!gameResponse.ok) {
            throw new Error(`Response status: ${gameResponse.status}`);
        }

        const game = await gameResponse.json();

        //const data = await gameResponse.json();
        return NextResponse.json(game);

    } catch (error) {
        console.log(error.message);
    }

    //return NextResponse.json({ message: `Hello from ${slug}`, status: 200 })
}