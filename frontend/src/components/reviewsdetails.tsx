import { ReviewsResponse } from "@/lib/types";

export const ReviewsDetail = ({ reviews }: { reviews: ReviewsResponse }) => {
  const { avg_rating, rating_count } = reviews.stats;
  return (
    <>
      <p className="text-sm text-text-secondary">
        {rating_count} ratings
      </p>
      <div className="border-b border-solid border-text-muted"/>
      <h2 className=" text-2xl font-bold">
        {avg_rating ? `${Number(avg_rating).toFixed(1)}` : "No ratings yet"}
      </h2>
    </>
  )
}
