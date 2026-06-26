import Image from "next/image";
import { apiFetch } from "@/lib/games";
import { ImageModal } from "@/components/imagemodal"

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
        {game.artwork_url && (
          <div className="flex flex-col h-130 items-center relative">
            <Image
              src={game.artwork_url}
              alt={game.slug}
              layout="fill"
              style={{ objectFit: "cover", objectPosition: "center 20%" }}
              quality={100}
            />
            <div className="absolute inset-0 bg-linear-to-t from-background-end from-10% to-transparent to-50%" />
          </div>
        )}
        <div
          className={`flex flex-row max-w-7/10 min-h-125 mx-auto ${game.artwork_url && "-mt-25"} p-2 relative`}
        >
          <div className="flex flex-col">
            <ImageModal
              thmb={game.cover_url}
              full={game.cover_url.replace("t_cover_big", "t_1080p")}
            />
            {reviews.stats.avg_rating}
          </div>
          <div className="flex flex-col max-w-3/5 p-4">
            <h1 className="font-bold text-4xl">{game.title}</h1>
            <p className="text-text-secondary font-semibold line-clamp-4 mt-10">
              {game.description}
            </p>
          </div>
        </div>
        <div className={`max-w-7/10 mx-auto ${game.artwork_url && "-mt-25"}`}>

        </div>
      </div>
    </>
  );
}
