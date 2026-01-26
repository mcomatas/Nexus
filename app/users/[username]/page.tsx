"use client";

import { use, useState, useEffect } from "react";
import { useSession } from "../../../auth-client";
import { GameCard } from "../../components/gamecard";
import { Loading } from "../../components/loading";
import Pagination from "../../ui/pagination";
import useSWR from "swr";
import Link from "next/link";
import { DEFAULT_PROFILE_IMAGE } from "../../lib/constants";

interface Props {
  params: {
    username: string;
  };
}

const PAGE_SIZE = 32;

export default function Page({ params }) {
  // params.username is the value from the URL. We call it usernameParam
  // because the API will return the canonical username (original casing)
  // which we want to display to the user.
  const obj = use(params);
  const username = obj["username"];
  const { data: session, isPending } = useSession();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (session?.user?.image) {
      setImageUrl(session.user.image);
    }
  }, [session]);

  const fetcher = (url) => fetch(url).then((r) => r.json());
  const { data, error, isLoading } = useSWR(
    () => `/api/users/${username}`,
    fetcher,
  );

  if (isLoading) return <Loading />;
  if (error) return <p>Error loading games.</p>;

  const gamesArray = (data?.games ?? []).map((game) => (
    <div key={game.id}>
      <GameCard
        src={
          game.cover
            ? "https:" + game.cover.url.replace("t_thumb", "t_720p")
            : "/default-cover.webp"
        }
        alt={game.slug}
        slug={game.slug}
      />
    </div>
  ));

  return (
    <div className="flex flex-col mx-auto max-w-4xl w-full px-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center pt-5 pb-5">
          <img
            src={imageUrl || DEFAULT_PROFILE_IMAGE}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full overflow-hidden"
          />
          <h1 className="px-3 text-3xl font-semibold">{session?.user?.name}</h1>
          <Link
            href="/settings"
            className="bg-primary mt-1 hover:bg-primary-dark text-white text-xs w-fit rounded-md px-2 py-2 font-semibold transition-all hover:shadow-lg cursor-pointer"
          >
            EDIT PROFILE
          </Link>
        </div>
        <div className="text-center">
          <h1 className="font-semibold text-2xl">{gamesArray.length}</h1>
          <h1 className="text-xs text-text-secondary">GAMES</h1>
        </div>
      </div>
      <h1 className="pt-5 pb-1 text-lg text-text-secondary">GAMES</h1>
      <div className="border-b border-0.5 border-text-muted" />
      <div className="grid grid-cols-4 gap-2 pt-4 place-items-center max-w-5xl mx-auto">
        {gamesArray}
      </div>
      {/*
                Leavin pagination out for now. Currently displaying all games a user has played on their profile.
                <Pagination totalCount={count} />
            */}
      <br />
    </div>
  );
}
