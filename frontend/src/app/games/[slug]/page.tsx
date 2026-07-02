import { apiFetch } from "@/lib/games";
import { GameDetail } from "@/components/gamedetail";
import { ReviewsDetail } from "@/components/reviewsdetails";
import { ReviewList } from "@/components/reviewslist";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

type GamePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reviewLimit: string }>;
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const { slug } = await params
  const { reviewLimit } = await searchParams;
  const limit = Number(reviewLimit) || 10; // We'll make 10 default page size
  const path = `games/slug/${slug}`;
  const game = await apiFetch(path);
  const user = await getCurrentUser();
  const reviewPath = `games/${game.igdb_id}/reviews?limit=${limit}${user ? `&userId=${user.id}` : ""}`;
  const reviews = await apiFetch(reviewPath);

  return (
    <>
      <div className="flex flex-col mb-10">
        <GameDetail game={game}>
          <ReviewsDetail reviews={reviews} user={user} game={game} />
        </GameDetail>
        <ReviewList reviews={reviews.reviews} />
        {reviews.reviews.length < Number(reviews.stats.review_count) && (
          <Link
            className="block w-fit my-6 bg-primary hover:bg-primary-dark transition-all cursor-pointer px-10 py-2 rounded-full mx-auto"
            href={`/games/${slug}?reviewLimit=${limit + 10}`}
            scroll={false}
          >
            Load More
          </Link>
        )}
      </div>
    </>
  );
}
