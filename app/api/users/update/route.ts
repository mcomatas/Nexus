import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '../../../../prisma';

export async function POST(req: NextRequest, res: NextResponse) {
    if (req.method !== 'POST') return;

    const response = await req.json();
    const  { userId, newUsername, newEmail } = response;

    // Find user
    const user = await prisma.user.findUnique({
        where: {
            id: userId 
        }
    });

    if (!user) {
        return NextResponse.json({ message: 'User not found' });
    }

    // Check if the new username or email already exists
    // Not sure if this would work exactly as if you were try to update to your current username
    // it might make cause some errors
    const existingUsername = await prisma.user.findUnique({
        where: {
            name: newUsername
        }
    });

    if (existingUsername) return NextResponse.json({ message: 'Username already exists'});

    const existingEmail = await prisma.user.findUnique({
        where: {
            email: newEmail
        }
    });

    if (existingEmail) return NextResponse.json({ message: 'Email already exists'});

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