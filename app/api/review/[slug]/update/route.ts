import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{slug: string}> }
) {
    const req = await request.json();
    const { slug } = await params;

    const existingReview = await prisma.review.findUnique({
        where: {
            userIdGameSlug: {
                userId: req.userId,
                gameSlug: slug
            }
        }
    });

    if (!existingReview) {
        return NextResponse.json({ message: 'Review not found' });
    }

    // Update the review
    const updatedReview = await prisma.review.update({
        where: {
            id: existingReview.id,
        },
        data: {
            rating: req.score,
            reviewText: req.review
        }
    });

    return NextResponse.json({ message: 'Review updated' });

}