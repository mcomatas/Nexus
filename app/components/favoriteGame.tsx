"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { IoAdd, IoClose } from "react-icons/io5";

export const FavoriteGame = ({ index, game, session, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/games?query=${encodeURIComponent(query)}&page=1`);
        const data = await res.json();
        setResults(data.games || []);
      } catch (error) {
        console.error(error);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const openModal = () => {
    setIsOpen(true);
    setQuery("");
    setResults([]);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const selectGame = async (selectedGame) => {
    setSaving(true);
    try {
      await fetch("/api/users/favoriteGame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          gameId: selectedGame.id,
          index,
        }),
      });
      onUpdate();
      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div
        onClick={openModal}
        className="flex items-center justify-center rounded-lg border-black border-solid border-2 aspect-9/12 bg-gray-700/50 h-50 w-38 group hover:scale-105 transition-all cursor-pointer overflow-hidden"
      >
        {game ? (
          <Image
            src={
              game.cover
                ? "https:" + game.cover.url.replace("t_thumb", "t_720p")
                : "/default-cover.webp"
            }
            alt={game.name}
            width={152}
            height={200}
            className="object-cover w-full h-full"
          />
        ) : (
          <IoAdd className="text-3xl text-text-secondary group-hover:text-4xl group-hover:text-text-primary transition-all" />
        )}
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-50">
          <div className="bg-surface-elevated rounded-lg w-200 h-150 flex flex-col shadow-shadow-elevated border border-primary/50">
            <div className="flex justify-between items-center border-b border-primary/50 p-4">
              <p className="text-lg text-text-primary font-semibold">
                Select Favorite Game
              </p>
              <button
                onClick={closeModal}
                className="text-2xl text-text-secondary hover:text-text-primary cursor-pointer transition-colors"
              >
                <IoClose />
              </button>
            </div>

            <div className="p-4">
              <input
                type="text"
                placeholder="Search for a game..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full bg-background-mid rounded-lg p-2.5 border border-primary/50 text-text-primary placeholder:text-text-secondary focus:outline-2 focus:outline-primary-light/70 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4 pt-0">
              {searching && (
                <p className="text-text-secondary text-sm text-center py-4">
                  Searching...
                </p>
              )}

              {!searching && query && results.length === 0 && (
                <p className="text-text-secondary text-sm text-center py-4">
                  No games found.
                </p>
              )}

              {saving && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 rounded-lg">
                  <p className="text-text-primary">Saving...</p>
                </div>
              )}

              <div className="grid grid-cols-4 gap-3">
                {results.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => selectGame(g)}
                    disabled={saving}
                    className="flex flex-col items-center rounded-lg p-2 hover:bg-surface-light cursor-pointer transition-colors group"
                  >
                    <div className="rounded-lg overflow-hidden aspect-9/12 w-full">
                      <Image
                        src={
                          g.cover
                            ? "https:" + g.cover.url.replace("t_thumb", "t_720p")
                            : "/default-cover.webp"
                        }
                        alt={g.name}
                        width={200}
                        height={267}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-text-secondary group-hover:text-text-primary text-xs mt-1 text-center line-clamp-2 transition-colors">
                      {g.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
