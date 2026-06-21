'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/lib/types';

const NavbarLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  return (
    <Link
      className={`text-md hover:bg-primary/30 transition rounded-md px-3 py-2`}
      href={href}
    >
      {children}
    </Link>
  );
};

const LoginLink = () => {
  return (
    <Link
      className={`text-md hover:bg-primary/30 transition rounded-md px-3 py-2`}
      href="/login"
    >
      Login
    </Link>
  )
}

const UserMenu = ({ user }: { user: User }) => {
  const router = useRouter();

  return (
    <div className="flex flex-row items-center gap-x-3">
      {user.username}
      <button
        className="bg-purple-400 text-gray-100 rounded-lg px-3 py-2 cursor-pointer"
        onClick={async () => {
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
              method: 'POST',
              credentials: 'include',
            });
            if (res.ok) router.refresh();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Logout
      </button>
    </div>
  )
}

function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') ?? '';

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = new FormData(e.currentTarget).get('query')?.toString().trim() ?? '';
    router.push(value ? `/games?query=${encodeURIComponent(value)}` : '/games');
  }

  return (
    <form onSubmit={handleSearch}>
      <input
        key={query}
        defaultValue={query}
        type="text"
        name="query"
        placeholder="Search games..."
        className="rounded-md bg-white/10 px-3 py-2 text-sm placeholder:text-text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
      />
    </form>
  );
}

export default function NavBar({ user }: { user: User | null }) {
  return (
    <div className="w-full bg-navbar-glass sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
        <Link href="/" className="text-2xl font-bold">
          Nexus
        </Link>

        <div className="flex items-center gap-x-4">
          <NavbarLink href="/games">
            GAMES
          </NavbarLink>

          <Suspense>
            <SearchForm />
          </Suspense>

          {user ? <UserMenu user={user} /> : <LoginLink />}
        </div>
      </div>
    </div>
  )
}
