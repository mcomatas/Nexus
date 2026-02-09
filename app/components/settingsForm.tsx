"use client";

import { useSession } from "../../auth-client";
import { useState } from "react";
import { Loading } from "./loading";
import { UploadButton } from "../utils/uploadthing";
import ProfilePicture from "./profilePicture";
import { FavoriteGame } from "./favoriteGame";
import useSWR from "swr";

export default function SettingsForm() {
  const { data: session, isPending } = useSession();
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const fetcher = (url) => fetch(url).then((r) => r.json());

  // Fetch user data to get favoriteGames IDs
  const { data: userData, mutate: mutateUser } = useSWR(
    session?.user ? `/api/users/${session.user.name}` : null,
    fetcher,
  );

  const favoriteIds = userData?.user?.favoriteGames || [];

  // Fetch game details for favorite game IDs
  const idsParam = favoriteIds.filter((id) => id > 0).join(",");
  const { data: favGamesData, mutate: mutateFavGames } = useSWR(
    idsParam ? `/api/games/byId?ids=${idsParam}` : null,
    fetcher,
  );

  const favoriteGamesMap = {};
  (favGamesData?.games || []).forEach((g) => {
    favoriteGamesMap[g.id] = g;
  });

  const handleFavoriteUpdate = () => {
    mutateUser();
    mutateFavGames();
  };

  if (isPending) {
    return <Loading />;
  }

  if (!session?.user) {
    return <div>You must be logged in to view this page</div>;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/users/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user.id,
          newUsername: newUsername || session?.user.name,
          newEmail: newEmail || session?.user.email,
        }),
      });

      const data = await res.json();
      console.log(data);
      alert(data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-5">
      <ProfilePicture />

      <h3 className="pt-5 pb-1 text-lg text-text-secondary">Favorite Games</h3>
      <div className="border-b border-0.5 border-text-muted" />
      <div className="flex flex-row pt-5 space-x-5">
        {[0, 1, 2, 3].map((i) => (
          <FavoriteGame
            key={i}
            index={i}
            game={favoriteGamesMap[favoriteIds[i]] || null}
            session={session}
            onUpdate={handleFavoriteUpdate}
          />
        ))}
      </div>

      <h3 className="pt-5 pb-1 text-lg text-text-secondary">Profile</h3>
      <div className="border-b border-0.5 border-text-muted" />
      <form onSubmit={handleSubmit} className="flex flex-col p-5 space-y-6">
        <div className="flex flex-col space-y-2">
          <label className="text-text-secondary text-sm">Username</label>
          <input
            type="text"
            name="username"
            defaultValue={session?.user.name || ""}
            className="bg-background-mid rounded-lg p-2.5 border border-primary/50 text-text-primary placeholder:text-text-secondary focus:outline-2 focus:outline-primary-light/70 focus:border-transparent transition-all"
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-text-secondary text-sm">Email</label>
          <input
            type="email"
            name="email"
            defaultValue={session?.user.email || ""}
            className="bg-background-mid rounded-lg p-2.5 border border-primary/50 text-text-primary placeholder:text-text-secondary focus:outline-2 focus:outline-primary-light/70 focus:border-transparent transition-all"
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark text-white w-fit rounded-lg px-4 py-2 font-semibold transition-all hover:shadow-lg cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
