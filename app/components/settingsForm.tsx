"use client";

import { useSession } from "../../auth-client";
import { useState } from "react";
import { Loading } from "./loading";
import { UploadButton } from "../utils/uploadthing";
import ProfilePicture from "./profilePicture";

export default function SettingsForm() {
  const { data: session, isPending } = useSession();
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

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
    <form onSubmit={handleSubmit} className="flex flex-col p-5 space-y-6">
      <ProfilePicture />

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
  );
}
