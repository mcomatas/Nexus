import { NextRequest, NextResponse } from "next/server";
import { prisma } from '../../../../prisma'

export async function POST( req: NextRequest, res: NextResponse) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    const { gameId, email } = response;

    if(!gameId || !email) {
        return 'no game id or email';
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        const games = user?.playedGames;
        const updatedGames = games?.filter((game) => game !== gameId);
        
        await prisma.user.update({
            where: {
                email: email
            },
            data: {
                playedGames: updatedGames
            },
        });

        return NextResponse.json({ message: 'Game Removed' });
    } catch (error) {
        console.log(error);
    }
}