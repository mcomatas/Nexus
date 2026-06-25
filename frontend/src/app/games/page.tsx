import { apiFetch } from "@/lib/games";
import { GameCard } from "@/components/gamecard";
import { Game } from "@/lib/types";
import Pagination from "@/components/pagination";

type GamesPageProps = {
  searchParams: Promise<{ query?: string, limit?: string }>;
};

export default async function GamesPage({ searchParams }: GamesPageProps) {
  const { query, limit = '32' } = await searchParams;
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (limit) params.set('limit', limit);
  const path = `games/search?${params.toString()}`;
  const { games, count }: { games: Game[], count: number } = await apiFetch(path);

  return (
    <div className="flex flex-col items-center mx-auto gap-5 py-5">
      <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
        {games.length === 0 ? (
          <p className="col-span-4 text-text-primary/60">
            {query ? `No games found for "${query}".` : "No games to show."}
          </p>
        ) : (
          games.map((game) => <GameCard key={game.igdb_id} game={game} />)
        )}
      </div>
      {Number(limit) < count ? <Pagination /> : <></>}
    </div>
  );
}
