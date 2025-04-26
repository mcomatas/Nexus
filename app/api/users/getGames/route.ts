import { NextResponse, NextRequest } from "next/server"
import { prisma } from '../../../../prisma'

export async function POST( req: NextRequest, res: NextResponse ) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    const username = response.username;
    //console.log(response);
    //console.log(response.username);
    try {
        const user = await prisma.user.findUnique({
            where: {
                name: username
            }
        });

        if(!user) return;
        //console.log(response?.playedGames);
        const ids = user.playedGames;
        const body = `fields name, slug, cover.url; where id = (${ids.join(',')});`

        // const query = '';
        // const page = 1;

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