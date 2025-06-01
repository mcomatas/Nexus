import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        const reviews = await prisma.review.findMany({
            where: {
                gameSlug: slug
            },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });

        const avg = await prisma.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                gameSlug: slug
            }
        });

        return NextResponse.json({ reviews, avg });

    } catch (error) {
        console.log(error);
    }
}