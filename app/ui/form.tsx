"use client";

import { useState } from "react";
import { authClient } from "../../auth-client";

const FormInput = ({ placeholder, type, name, className, value, onChange }) => {
  return (
    <input
      placeholder={placeholder}
      type={type}
      name={name}
      className={className}
      value={value}
      onChange={onChange}
    />
  );
};

export function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL: "/",
      });

      if (error) {
        setError(error.message || "Failed to send magic link");
      } else {
        setSent(true);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col p-10 space-y-4 text-center">
        <p className="text-text-primary text-lg">Check your email!</p>
        <p className="text-text-secondary">
          We sent a magic link to <strong>{email}</strong>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-10 space-y-10">
      <FormInput
        className="bg-background-mid rounded-lg p-2.5 border border-primary/50 text-text-primary placeholder:text-text-secondary focus:outline-2 focus:outline-primary-light/70 focus:border-transparent transition-all"
        type="email"
        name="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-primary hover:bg-primary-dark text-white mx-auto rounded-lg p-2.5 font-semibold transition-all hover:shadow-lg cursor-pointer disabled:opacity-50"
      >
        {loading ? "Sending..." : "Continue with email"}
      </button>
    </form>
  );
}

export function SignOut() {
  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <button onClick={handleSignOut} type="button">
      Sign Out
    </button>
  );
}
