"use client";

import { useSession } from "../../auth-client";
import { useState, useEffect } from "react";
import { IoGameController, IoGameControllerOutline } from "react-icons/io5";

export default function AddRemoveButton({ game }) {
  const { data: session, isPending } = useSession();
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    // Check if user has played this game by fetching from API
    if (session?.user) {
      fetch(`/api/users/${session.user.name}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.playedGames) {
            setPlayed(data.user.playedGames.includes(game.id));
          }
        })
        .catch(console.error);
    }
  }, [session, game.id]);

  if (isPending) return null;

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
