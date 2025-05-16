import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../../prisma';

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    const  { userId, newUsername, newEmail } = response;

    const conflicts = await prisma.user.findMany({
        where: {
            OR: [
                { name: newUsername },
                { email: newEmail }
            ],
            NOT: {
                id: userId // Exludes the current user
            }
        }
    });
    
    if (conflicts.length > 0) {
        const conflict = conflicts[0];
        if (conflict.name === newUsername) return NextResponse.json({ message: 'Username already exists' });
        if (conflict.email === newEmail) return NextResponse.json({ message: 'Email already exists' });

        return NextResponse.json({ message: 'Unknown error occurred' });
    }

    // Update user
    const updatedUser = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            name: newUsername,
            email: newEmail
        }
    });

    return NextResponse.json({ message: 'User updated' });

}