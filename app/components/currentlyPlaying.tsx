"use client";

import { useSession } from "../../auth-client";
import { useState, useEffect } from "react";
import { IoPlay, IoPlayOutline } from "react-icons/io5";

export default function CurrentlyPlaying({ game }) {
  const { data: session, isPending } = useSession();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetch(`/api/users/${session.user.name}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user?.currentlyPlaying === game.id) {
            setIsPlaying(true);
          }
        })
        .catch(console.error);
    }
  }, [session, game.id]);

  if (isPending) return null;

  const handleToggle = async () => {
    if (!session?.user) {
      alert("You need to be signed in");
      return;
    }

    try {
      const res = await fetch("/api/users/currentlyPlaying", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          gameId: game.id,
        }),
      });
      const data = await res.json();
      setIsPlaying(data.currentlyPlaying !== null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className={`cursor-pointer text-5xl hover:text-green-400 ${isPlaying ? "text-green-500" : "text-text-primary"}`}
        onClick={handleToggle}
      >
        {isPlaying ? <IoPlay /> : <IoPlayOutline />}
      </button>
      <span className={isPlaying ? "text-green-500" : ""}>Playing</span>
    </div>
  );
}
