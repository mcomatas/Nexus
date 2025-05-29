import { NextResponse, NextRequest } from "next/server"
import { prisma } from '../../../../prisma'

export async function POST( req: NextRequest, res: NextResponse ) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    const username = response.username;

    try {
        const user = await prisma.user.findUnique({
            where: {
                name: username
            }
        });

        if(!user) return;

        // Currently displaying all played games. Might change to pagination later.
        const ids = user.playedGames;
        const body = `fields name, slug, cover.url; where id = (${ids.join(',')}); limit ${ids.length};`

        const gamesResponse = await fetch(`http://localhost:3000/api/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ body }),
        });

        const data = await gamesResponse.json();
        
        return NextResponse.json({ data });


    } catch (error) {
        console.log(error);
    }

    // return NextResponse.json({message: 'Hello'});
}