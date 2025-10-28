import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../../prisma';
import { auth } from '../../../../../../auth'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{slug: string}> }
) {
    const { slug } = await params;
    const session = await auth();

    if(!session) return NextResponse.json({ review: null, reason: 'unauthenticated' }, { status: 200 });

    try {
        const review = await prisma.review.findUnique({
            where: {
                userIdGameSlug: {
                    userId: session?.user.id,
                    gameSlug: slug
                }
            }
        });

        return NextResponse.json({ review });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: 'Error fetching review' }, { status: 500 });
    }
}