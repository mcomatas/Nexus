import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../../prisma';
import getAccessToken from '../../../lib/getAccessToken';

export async function GET(
    request: NextRequest, 
    { params }: { params: Promise<{ username: string }>}
) {
    const { username } = await params;
    const accessToken = await getAccessToken();
    //console.log("Username: ", username);

    try {        
        // Use a case-insensitive lookup so URLs are not case-sensitive.
        const user = await prisma.user.findFirst({
            where: {
                name: { equals: username, mode: 'insensitive' }
            }
        });

        if(!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        //console.log(user);
        const ids = user.playedGames;
        if (!ids.length) return NextResponse.json({ data: [] }); //Handle case where no games are played
        
        const body = `fields name, slug, cover.url; where id = (${ids.join(',')}); limit ${ids.length};`;

        const gamesResponse = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': process.env.IGDB_CLIENT_ID,
                'Authorization': `Bearer ${accessToken}`
            },
            //body: req.body
            body: body
        });

        /*const gamesResponse = await fetch(`http://localhost:3000/api/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body }),
        });*/

        const games = await gamesResponse.json();
        
        return NextResponse.json({ games, user });

    } catch (error) {
        console.error("Error fetching user: ", error);
    }
}