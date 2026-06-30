'use client';

import Image from "next/image";
import { DetailedGame } from "@/lib/types";
import { ImageModal } from "@/components/imagemodal";
import { useState } from "react";

export const GameDetail = ({ game, children }: { game: DetailedGame, children?: React.ReactNode }) => {

  const [expanded, setExpanded] = useState(false);
  // Heuristic: show the toggle only when the description is long enough to clamp.
  // Approximate (char count, not rendered lines) but no layout measurement needed.
  const isClamped = !!game.description && game.description.length > 500;

  return (
    <>
      {game.artwork_url && (
        <div className="flex flex-col h-130 items-center relative">
          <Image
            src={game.artwork_url}
            alt={game.slug}
            layout="fill"
            style={{ objectFit: "cover", objectPosition: "center 20%" }}
            quality={100}
          />
          <div className="absolute inset-0 bg-linear-to-t from-background-end from-10% to-transparent to-50%" />
        </div>
      )}
      <div
        className={`flex flex-row max-w-7/10 min-h-125 mx-auto ${game.artwork_url && "-mt-25"} p-2 relative`}
      >
        <div className="flex flex-col shrink-0">
          <ImageModal
            thmb={game.cover_url}
            full={game.cover_url.replace("t_cover_big", "t_1080p")}
          />
        </div>
        <div className="flex flex-col max-w-1/2 p-4">
          <h1 className="font-bold text-4xl">{game.title}</h1>
          <p
            className={`text-text-secondary font-semibold mt-10 ${expanded ? "line-clamp-none" : "line-clamp-8"}`}
          >
            {game.description}
          </p>
          {isClamped && <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm ml-auto text-gray-400 hover:underline cursor-pointer"
          >
            {expanded ? "Read less" : "Read more"}
          </button>}
        </div>
        <div className="ml-auto justify-between">
          {children}
        </div>
      </div>
    </>
  )
}
