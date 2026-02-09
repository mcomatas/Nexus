import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../prisma";

export async function POST(req: NextRequest) {
  const { email, gameId, index } = await req.json();

  if (!email || gameId === undefined || index === undefined) {
    return NextResponse.json(
      { error: "Missing email, gameId, or index" },
      { status: 400 },
    );
  }

  if (index < 0 || index > 3) {
    return NextResponse.json({ error: "Index must be 0-3" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const favorites = [...user.favoriteGames];

    // Pad array with 0s if shorter than needed
    while (favorites.length <= index) {
      favorites.push(0);
    }

    favorites[index] = gameId;

    await prisma.user.update({
      where: { email },
      data: { favoriteGames: favorites },
    });

    return NextResponse.json({ message: "Favorite game updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update favorite game" },
      { status: 500 },
    );
  }
}
