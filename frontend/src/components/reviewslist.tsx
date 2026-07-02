import { Review } from "@/lib/types";

export const ReviewList = ({ reviews }: { reviews: Review[] }) => {
  const reviewMap = reviews.map((review) => (
    <div
      key={review.id}
      className="flex flex-col gap-y-2 py-2"
    >
      <div className="border-b border-text-muted"/>
      <div className="flex flex-row gap-x-1 text-text-muted">
        Review by
        <p className="font-semibold text-text-primary">{review.username}</p>
        {review.rating && <p className="text-text-secondary">- {review.rating}</p>}
      </div>
      <p className="text-text-secondary">{review.review_text}</p>
    </div>
  ))

  return (
    <div className="w-full max-w-7/10 mx-auto">
      <h1 className="text-xl font-bold">Reviews</h1>
      {reviews.length === 0 ?
        <>
          <div className="border-b border-text-muted py-1 mb-1"/>
          <p className="text-text-secondary">No reivews yet...</p>
        </>
        :
        reviewMap
      }
    </div>
  )
}
