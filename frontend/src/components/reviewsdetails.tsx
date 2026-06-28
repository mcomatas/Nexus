import { ReviewsResponse, User } from "@/lib/types";
import { ReviewForm } from "@/components/reviewform"

export const ReviewsDetail = ({ reviews, user }: { reviews: ReviewsResponse, user: User }) => {
  const { avg_rating, rating_count } = reviews.stats;
  return (
    <div>
      <div className="bg-gray-700 p-4 rounded-2xl w-60 mt-10">
        <ReviewForm user={user} userReview={reviews.user_review} />
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
