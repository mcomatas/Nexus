import { NextResponse, NextRequest } from "next/server";
import getAccessToken from "../../../lib/getAccessToken";

type Params = { slug: string }

export async function GET(request: NextRequest, segmentData: { params: Params }) {
    const params = await segmentData.params;
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

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.log(error.message);
    }

    //return NextResponse.json({ message: `Hello from ${slug}`, status: 200 })
}