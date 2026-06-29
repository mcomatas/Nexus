import { Review } from "@/lib/types";

export const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  console.log(reviews);
  const reviewMap = reviews.map((review) => (
    <span key={review.id}>
      <h1 className="font-bold text-xl">{review.username} - {review.rating}</h1>
      {review.review_text}
    </span>
  ))

  return (
    <div className="w-full max-w-7/10 mx-auto p-2">
      {reviewMap}
    </div>
  )
}
