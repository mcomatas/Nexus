import { apiFetch } from "@/lib/games";
import { GameDetail } from "@/components/gamedetail";
import { ReviewsDetail } from "@/components/reviewsdetails";

type GamePageProps = {
  params: Promise<{ slug: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params
  const path = `games/slug/${slug}`;
  const game = await apiFetch(path);
  const reviewPath = `games/${game.igdb_id}/reviews`;
  const reviews = await apiFetch(reviewPath);
  console.log(game);
  console.log(reviews);

  return (
    <>
      <div>
        <GameDetail game={game}>
          <ReviewsDetail reviews={reviews} />
        </GameDetail>
      </div>
    </>
  );
}
