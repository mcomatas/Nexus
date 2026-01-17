"use client";

import { useSession } from "next-auth/react";
import { prisma } from "../../prisma";
import { useState, useEffect } from "react";
import { IoGameController, IoGameControllerOutline } from "react-icons/io5";

//className="bg-primary text-text-primary text-xl rounded-md mr-auto pl-2 pr-2 pt-0.5 pb-0.5 hover:bg-primary-dark transition-all cursor-pointer"

export default function AddRemoveButton({ game }) {
  const { data: session, status } = useSession();
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    if (session?.user?.playedGames) {
      setPlayed(session.user.playedGames.includes(game.id));
    }
  }, [session]);

  if (status === "loading") return null;

  const handleAdd = async () => {
    if (!session?.user) {
      alert("You need to be signed in to add");
      return;
    }

    try {
      const res = await fetch("/api/users/addGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: game.id,
          email: session.user.email,
        }),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemove = async () => {
    try {
      const res = await fetch("/api/users/removeGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: game.id,
          email: session.user.email,
        }),
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className={`cursor-pointer text-5xl hover:text-primary-light ${played ? "text-primary" : "text-text-primary"}`}
        onClick={
          played
            ? () => {
                handleRemove();
                setPlayed(!played);
              }
            : () => {
                handleAdd();
                setPlayed(!played);
              }
        }
      >
        {played ? <IoGameController /> : <IoGameControllerOutline />}
      </button>
      <span>{played ? "Played" : "Play"}</span>
    </div>
  );
}
