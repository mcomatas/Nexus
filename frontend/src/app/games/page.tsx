import { apiFetch } from "@/lib/games";
import { GameCard } from "@/components/gamecard";
import { Game } from "@/lib/types";

type GamesPageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const { query } = await searchParams;
  const path = query ? `games/search?query=${encodeURIComponent(query)}` : "games/search";
  const games: Game[] = await apiFetch(path);

  return (
    <div className="grid grid-cols-4 gap-4">
      {games.length === 0 ? (
        <p className="col-span-4 text-text-primary/60">
          {query ? `No games found for "${query}".` : "No games to show."}
        </p>
      ) : (
        games.map((game) => <GameCard key={game.igdb_id} game={game} />)
      )}
    </div>
  );
}
