"use client";

import { GameCard } from "../components/gamecard";
import Pagination from "../ui/pagination";
import { use } from "react";
import useSWR from "swr";

const PAGE_SIZE = 32;

export default function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: number;
  }>;
}) {
  const searchParams = use(props.searchParams);
  const query = searchParams?.query || "";
  const page = searchParams?.page || 1;

  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isLoading } = useSWR(
    `/api/games?query=${query}&page=${page}`,
    fetcher,
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading games</p>;

  const gamesArray = data.games.map((game) => (
    <div key={game.id}>
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
    <div>
      <div className="max-w-5xl px-10 mx-auto">
        <h1 className="flex mx-auto text-md pt-2">Games</h1>
        <div className="border-b border-solid mx-auto border-0.5 border-text-muted" />
        <div className="grid grid-cols-4 gap-2 pt-4 place-items-center mx-auto">
          {gamesArray}
        </div>

        {/*Pagination Controls*/}
        {data && <Pagination totalCount={data.count.count} />}
      </div>
    </div>
  );
}
