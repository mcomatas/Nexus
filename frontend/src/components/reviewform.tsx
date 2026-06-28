"use client";

import Link from "next/link"
import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { User, Review } from "@/lib/types"

function handleSubmit() {
  console.log("Submitting");
}

const Form = ({ onClose, userReview }: { onClose: () => void, userReview: Review | null }) => {
  const [rating, setRating] = useState(userReview?.rating);
  const [reviewText, setReviewText] = useState(userReview?.review_text);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-xl z-50">
      <div className="bg-surface-elevated rounded-lg h-150 w-200 flex flex-col shadow-shadow-elevated border border-text-secondary/50">
        <div className="flex ml-auto">
          <button
            onClick={onClose}
            className="text-2xl text-text-secondary p-2 pr-5 hover:text-text-primary cursor-pointer transition-colors"
          >
            <IoClose />
          </button>
        </div>
        <div className="flex flex-row items-center justify-center space-x-20 p-5">
          <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
            <input
              className="bg-background-mid rounded-lg p-2.5 border border-primary/50 text-text-primary placeholder:text-text-secondary focus:outline-2 focus:outline-primary-light/70 focus:border-transparent transition-all"
              name="score"
              placeholder="Score"
              type="number"
              step="0.1"
              max="10"
              min="0"
              value={rating ?? ""}
              onChange={(e) => setRating(Number(e.target.value))}
            />
            <textarea
              className="bg-background-mid rounded-lg h-90 w-120 p-2.5 text-sm border border-primary/50 text-text-primary placeholder:text-text-secondary focus:outline-2 focus:outline-primary-light/70 focus:border-transparent transition-all duration-300 resize-none"
              placeholder="Write your review here..."
              name="review"
              value={reviewText ?? ""}
              onChange={(e) => setReviewText(e.target.value)}
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary-dark text-white w-30 mx-auto rounded-lg py-2.5 font-semibold transition-all hover:shadow-lg cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export const ReviewForm = ({ user, userReview }: { user: User | null, userReview: Review | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(user);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <div className="flex justify-center">
      {user ?
        <>
          <button
            onClick={openModal}
            className="cursor-pointer"
          >
            Rate Game
          </button>
          {isOpen && (
            <Form onClose={closeModal} userReview={userReview} />
          )}
        </>
        :
        <Link
          className="text-md whitespace-nowrap cursor-pointer"
          href="/login"
        >
          Sign in to log, rate, or review
        </Link>
      }
    </div>
  )
}
