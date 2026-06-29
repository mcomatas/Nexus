"use client";

import { Game, Review } from "@/lib/types";
import { IoGameController, IoGameControllerOutline } from "react-icons/io5";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const AddRemoveGameButton = ({ game, userReview }: { game: Game, userReview: Review | null }) => {
  const [played, setPlayed] = useState(userReview !== undefined);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function toggle() {
    const next = !played;
    setPlayed(next);
    setPending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/game-logs`, {
        method: next ? "POST" : "DELETE",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ igdb_id: game.igdb_id })
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setPlayed(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className="text-6xl text-primary cursor-pointer hover:text-primary-light pb-1"
    >
      {played ?
        <IoGameController />
        :
        <IoGameControllerOutline />
      }
    </button>
  )
}
