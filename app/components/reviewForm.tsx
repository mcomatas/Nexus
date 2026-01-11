"use client";

import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import AddRemoveButton from "./addRemoveButton";
import { GameCard } from "./gamecard";
import useSWR from "swr";
import { IoClose } from "react-icons/io5";

export default function ReviewForm({ game }) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [score, setScore] = useState("");
  const [review, setReview] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const {
    data: reviewData,
    error: reviewError,
    isLoading: reviewLoading,
  } = useSWR(`/api/users/review/${game.slug}/get`, fetcher);

  useEffect(() => {
    if (reviewData) {
      if (reviewData?.review) setReviewed(true);
      setScore(reviewData?.review?.rating || "");
      setReview(reviewData?.review?.reviewText || "");
    }
  }, [reviewData]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const reviewResponse = await fetch(
        `/api/review/${game.slug}/${reviewed ? "update" : "add"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            slug: game.slug,
            score: parseFloat(score),
            review: review,
            userId: session.user.id,
          }),
        },
      );

      if (!reviewed) {
        const addGameResponse = await fetch("/api/users/addGame", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: game.id,
            email: session.user.email,
          }),
        });
        const addGameData = await addGameResponse.json();
        console.log(addGameData);
      }

      const reviewData = await reviewResponse.json();

      if (reviewResponse.ok) closeModal();
    } catch (error) {
      console.log(error);
    }
  }

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  if (status === "loading" || reviewLoading) {
    return (
      <div className="bg-gray-400 rounded-sm mt-15 p-5 w-50 text-white">
        Loading review...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-400 rounded-sm mt-15 p-5 w-50 text-white">
        You need to be signed in to review a game.
      </div>
    );
  }

  return (
    <div className="bg-surface-elevated rounded-lg mt-15 flex flex-col space-y-5">
      <span className="pt-5 pl-3">
        <AddRemoveButton game={game} />
      </span>
      <span className="border-b border-primary/50" />
      <button
        onClick={openModal}
        className="text-text-primary pb-5 pl-3 pr-3 hover:text-text-secondary cursor-pointer transition-colors font-medium"
      >
        Review Game
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-50">
          <div className="bg-surface-elevated rounded-lg h-150 w-250 flex flex-col shadow-shadow-elevated border border-primary/50">
            <div className="flex justify-between border-b border-primary/50">
              <p className="text-lg text-text-primary p-2 pl-5 font-semibold">
                Review {game.name}
              </p>
              <button
                onClick={closeModal}
                className="text-2xl text-text-secondary p-2 pr-5 hover:text-text-primary cursor-pointer transition-colors"
              >
                <IoClose />
              </button>
            </div>
            <div className="flex flex-row items-center justify-center space-x-20 p-5">
              <GameCard
                src={
                  game.cover
                    ? "https:" + game.cover.url.replace("t_thumb", "t_720p")
                    : "/default-cover.webp"
                }
                alt={game.slug}
                slug={game.slug}
              />
              <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
                <input
                  className="bg-background-mid rounded-lg p-2.5 border border-primary/50 text-text-primary placeholder:text-text-secondary focus:outline-2 focus:outline-primary-light/70 focus:border-transparent transition-all"
                  name="score"
                  placeholder="Score"
                  type="number"
                  step="0.1"
                  max="10"
                  min="0"
                  value={score ?? ""}
                  onChange={(e) => setScore(e.target.value)}
                />
                <textarea
                  className="bg-background-mid rounded-lg h-90 w-120 p-2.5 text-sm border border-primary/50 text-text-primary placeholder:text-text-secondary focus:outline-2 focus:outline-primary-light/70 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Write your review here..."
                  name="review"
                  value={review ?? ""}
                  onChange={(e) => setReview(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white w-30 mx-auto rounded-lg py-2.5 font-semibold transition-all hover:shadow-lg cursor-pointer"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
