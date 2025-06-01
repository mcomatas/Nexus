import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '../../../../../prisma';

export async function POST(
    request: NextRequest,
    { params } : { params: Promise<{ slug: string }> }
) {
    if (request.method !== 'POST') return;

    const req = await request.json();
    const { slug } = await params;

    // Check if the game exists in the prisma DB
    const game = await prisma.game.findUnique({
        where: {
            slug: slug
        }
    });

    // If the game doesn't exist add it to the DB
    if(!game) {
        const newGame = await prisma.game.create({
            data: {
                id: req.gameId,
                slug: slug
            }
        });
        //console.log(newGame);
    }

    const review = await prisma.review.create({
        data: {
            rating: req.score,
            reviewText: req.review,
            userId: req.userId,
            gameSlug: slug
        }
    });

    return NextResponse.json({ message: 'Review added' });

}