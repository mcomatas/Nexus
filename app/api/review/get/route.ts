import { NextResponse, NextRequest } from "next/server";
import { prisma } from '../../../../prisma';

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    //console.log(response);

    try {
        const reviews = await prisma.review.findMany({
            where: {
                gameId: response.gameId     
            },
            include: {
                user: {
                    select: { name: true }
                }
            }
        });
        //console.log(reviews);

        const avg = await prisma.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                gameId: response.gameId
            }
        });
        //console.log(avg);

        return NextResponse.json({ reviews, avg });
    } catch (error) {
        console.log(error);
    }

}