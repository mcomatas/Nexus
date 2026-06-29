import { apiFetch } from "@/lib/games";
import { GameDetail } from "@/components/gamedetail";
import { ReviewsDetail } from "@/components/reviewsdetails";
import { ReviewList } from "@/components/reviewslist";
import { getCurrentUser } from "@/lib/session";

type GamePageProps = {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params
  const path = `games/slug/${slug}`;
  const game = await apiFetch(path);
  const user = await getCurrentUser();
  const reviewPath = `games/${game.igdb_id}/reviews${user ? `?userId=${user.id}` : ""}`;
  const reviews = await apiFetch(reviewPath);

  return (
    <>
      <div className="flex flex-col">
        <GameDetail game={game}>
          <ReviewsDetail reviews={reviews} user={user} game={game} />
        </GameDetail>
        <ReviewList reviews={reviews.reviews} />
      </div>
    </>
  );
}
