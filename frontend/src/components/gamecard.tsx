import Link from "next/link";
import Image from "next/image";
import { Game } from "@/lib/types";

export const GameCard = ({ game }: { game: Game }) => {
  return (
    <Link href={`/games/${game.slug}`}>
      <Image
        className="rounded-lg border-black border-solid border-2 aspect-9/12 hover:border-text-primary/70 hover:border-4 transition-all"
        src={game.cover_url}
        alt={game.title}
        height={300}
        width={240}
        quality={100}
      />
    </Link>
  );
};
