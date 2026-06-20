'use client';

import Link from 'next/link';

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

export default function NavBar() {
  return (
    <div className="w-full bg-navbar-glass sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
        <Link href="/" className="text-2xl font-bold">
          Nexus
        </Link>

        <div className="flex justify-evenly items-center gap-x-6">
          <NavbarLink href="/games">
            GAMES
          </NavbarLink>
        </div>
      </div>
    </div>
  )
}
