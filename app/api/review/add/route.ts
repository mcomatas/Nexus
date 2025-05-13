import { NextResponse, NextRequest } from "next/server";
import { prisma } from '../../../../prisma';

export async function POST(req: NextRequest) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    //console.log(response.gameId);

    //Very first thing is to check if the game exists in my prisma db
    const game = await prisma.game.findUnique({
        where: {
            id: response.gameId
        }
    });
    
    //If no game then add game to prisma db
    if (!game) {
        const newGame = await prisma.game.create({
            data: {
                id: response.gameId,
            }
        });
        console.log(newGame);
    }

    // Then create the review itself
    const review = await prisma.review.create({
        data: {
            rating: response.score,
            reviewText: response.review,
            gameId: response.gameId,
            userId: response.userId
        }
    });

    return NextResponse.json({ message: "Review added" });
}