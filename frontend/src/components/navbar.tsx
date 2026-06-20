'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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

export default function NavBar() {
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

          <Link
            href="/login"
            className="rounded-md bg-primary/80 hover:bg-primary px-4 py-2 text-sm font-medium transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
