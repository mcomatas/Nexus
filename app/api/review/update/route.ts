import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../../prisma';

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    const { gameId, userId, score, review } = response;

    // Check if the review exists
    const existingReview = await prisma.review.findUnique({
        where: {
            userGameId: {
                userId: userId,
                gameId: gameId,
            },
        },
    });

    // If the review doesn't exist, return an error message
    if (!existingReview) {
        return NextResponse.json({ message: 'Review not found' });
    }

    // Update the review
    const updatedReview = await prisma.review.update({
        where: {
            id: existingReview.id,
        },
        data: {
            rating: score,
            reviewText: review,
        },
    });

    return NextResponse.json({ message: 'Review updated' });

}