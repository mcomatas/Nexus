import { ReviewsResponse, User, Game } from "@/lib/types";
import { ReviewForm } from "@/components/reviewform"
import { AddRemoveGameButton } from "@/components/addremovegamebutton";

export const ReviewsDetail = ({ reviews, user, game }: { reviews: ReviewsResponse, user: User, game: Game }) => {
  const { avg_rating, rating_count } = reviews.stats;
  return (
    <div>
      <div className="bg-gray-700 p-4 rounded-2xl w-60 mt-10 flex flex-col items-center justify-center">
        <AddRemoveGameButton game={game} userReview={reviews.user_review} />
        <div className="border-b border-solid border-text-secondary/50 w-50"/>
        <ReviewForm user={user} userReview={reviews.user_review} game={game} />
      </div>
      <br />
      <p className="text-sm text-text-secondary">
        {rating_count} ratings
      </p>
      <div className="border-b border-solid border-text-muted"/>
      <h2 className=" text-2xl font-bold">
        {avg_rating ? `${Number(avg_rating).toFixed(1)}` : "No ratings yet"}
      </h2>
    </div>
  )
}
