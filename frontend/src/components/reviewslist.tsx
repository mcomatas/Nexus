import { Review } from "@/lib/types";

export const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  console.log(reviews);
  const reviewMap = reviews.map((review) => (
    <div
      key={review.id}
      className="flex flex-col gap-y-4 py-2"
    >
      <div className="flex flex-row gap-x-1 text-text-muted">
        Review by <p className="font-semibold text-text-primary">{review.username} - {review.rating}</p>
      </div>
      <p className="text-text-secondary">{review.review_text}</p>
      <div className="border-b border-text-muted py-2"/>
    </div>
  ))

  return (
    <div className="w-full max-w-7/10 mx-auto p-2">
      <h1 className="font-bold">Reviews</h1>
      <div className="border-b border-text-muted pt-1"/>
      {reviewMap}
    </div>
  )
}
