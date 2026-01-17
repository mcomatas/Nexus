"use client";

import Link from "next/link";
//import { auth } from "../auth";
import { prisma } from "../prisma";
import { GameCard } from "./components/gamecard";
import useSWR from "swr";

export default function Page() {
  //const session = await auth();

  //console.log(session);
  //console.log(session?.user?.email);

  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isLoading } = useSWR(`/api/popscore`, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading games</p>;

  //console.log(data);

  const gamesArray = data.map((game) => (
    <div key={game.id} className="snap-center flex-shrink-0 w-64">
      <GameCard
        src={
          game.cover
            ? "https:" + game.cover.url.replace("t_thumb", "t_720p")
            : "/default-cover.webp"
        }
        alt={game.slug}
        slug={game.slug}
      />
    </div>
  ));

  return (
    <div className="flex flex-col mx-auto p-5">
      <h1 className="text-2xl">Welcome to the Nexus homepage!</h1>
      <div className="flex flex-nowrap gap-4 overflow-x-auto snap-x snap-mandatory pb-4">
        {gamesArray}
      </div>
    </div>
  );
}
