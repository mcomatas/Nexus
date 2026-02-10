import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../prisma";

export async function POST(req: NextRequest) {
  const { email, gameId } = await req.json();

  if (!email || gameId === undefined) {
    return NextResponse.json(
      { error: "Missing email or gameId" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If the game is already currently playing, unset it (toggle off)
    const newValue = user.currentlyPlaying === gameId ? null : gameId;

    await prisma.user.update({
      where: { email },
      data: { currentlyPlaying: newValue },
    });

    return NextResponse.json({
      message: newValue ? "Currently playing updated" : "Currently playing cleared",
      currentlyPlaying: newValue,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update currently playing" },
      { status: 500 },
    );
  }
}
