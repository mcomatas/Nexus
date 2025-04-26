import { NextResponse, NextRequest } from "next/server";
import { prisma } from '../../../../prisma';

export async function POST( req: NextRequest, res: NextResponse ) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    const { gameId, email } = response;
    //console.log(gameId, name);

    if(!gameId || !email ) {
        return 'no game id or name';
    }

    try {
        await prisma.user.update({
            where: {
                email: email,
            },
            data: {
                playedGames: {
                    push: gameId
                }
            }
        })

        return NextResponse.json({ message: 'Game Added' });
    } catch (error) {
        console.log(error);
    }

    //return NextResponse.json({ message: 'hello' });

}