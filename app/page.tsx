"use client";

import Link from "next/link";
//import { auth } from "../auth";
import { prisma } from "../prisma";
import { GameCard } from "./components/gamecard";
import useSWR from "swr";
import { useRef } from "react";
import { IoArrowForward, IoArrowBack } from "react-icons/io5";
import { GameCarousel } from "./components/gameCarousel";

export default function Page() {
  //const session = await auth();

  //console.log(session);
  //console.log(session?.user?.email);

  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isLoading } = useSWR(`/api/popscore`, fetcher);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 600, behavior: "smooth" });
  };

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
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl">Welcome to the Nexus homepage!</h1>
        <p className="text-text-secondary pb-10">
          A site to log, review, and discover new video games
        </p>
      </div>

      {/*Carousel container*/}
      <GameCarousel games={gamesArray} header="Top 10 IGDB Playing" />
    </div>
  );
}
