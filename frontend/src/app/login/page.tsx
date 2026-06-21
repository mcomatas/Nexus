'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === "register";
  const endpoint = isRegister ? "auth/register" : "auth/login";

  function toggle() {
    setMode(isRegister ? "login" : "register");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`, {
        method: "POST",
        credentials: "include", // store the session cookie the backend sets
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isRegister ? { email, username, password } : { email, password }
        ),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong");
        return;
      }

      // Success: cookie is set. Re-run server components (so the navbar
      // picks up the new session) then send them on their way.
      router.push("/");
      router.refresh();
    } catch {
      setError("Network error — is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        {isRegister ? "Create an account" : "Log in"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-md bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        {isRegister && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="rounded-md bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        )}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-md bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary/80 hover:bg-primary px-4 py-2 text-sm font-medium transition disabled:opacity-50"
        >
          {loading ? "Please wait…" : isRegister ? "Sign up" : "Log in"}
        </button>
      </form>

      <button
        onClick={toggle}
        className="mt-4 text-sm text-text-primary/70 hover:text-text-primary transition"
      >
        {isRegister
          ? "Already have an account? Log in"
          : "Need an account? Sign up"}
      </button>
    </div>
  );
}
