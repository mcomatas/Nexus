'use client'

import { apiFetch } from "@/lib/games";
import { useState, useEffect } from "react";
import { GameCard } from "@/components/gamecard";
import { Game } from "@/lib/types";


export default function Home() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    async function searchGames() {
      const games = await apiFetch("games/search");
      //console.log(games);
      setGames(games);
    }
    searchGames();
  }, [])

  return (
    <div className="grid grid-cols-4 gap-4">
      {games.map((game) => {
        return (
          <GameCard key={game.igdb_id} game={game} />
        )
      })}
    </div>
  );
}
