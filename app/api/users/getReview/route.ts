import { NextResponse, NextRequest } from "next/server";
import { prisma } from '../../../../prisma';

export async function POST( req: NextRequest, res: NextResponse ) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    const { gameId, userId } = response;
    //console.log(response);
    //console.log(gameId);

    try {
        const review = await prisma.review.findUnique({
            where: {
                userGameId: {
                    userId: userId,
                    gameId: gameId
                }
            }
        });
        //console.log(review);

        return NextResponse.json({ review });
    } catch (error) {
        console.log(error);
    }

    return NextResponse.json({ message: 'hello' });
}