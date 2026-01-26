"use client";

import Link from "next/link";
import "../ui/global.css";
import Search from "../ui/search";
import { useSession, signOut } from "../../auth-client";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";
import { useState, useEffect } from "react";
import { DEFAULT_PROFILE_IMAGE } from "../lib/constants";

const NavbarLink = ({ href, children, className = "", ...props }) => {
  return (
    <Link
      className={`text-md hover:bg-primary/30 transition rounded-md px-3 py-2 ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (session?.user?.image) {
      setImageUrl(session.user.image);
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  return (
    <div className="w-full bg-navbar-glass text-text-primary sticky top-0 z-50 font-heading">
      <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
        <Link href="/" className="text-2xl font-bold">
          Nexus
        </Link>
        <div className="flex justify-evenly items-center gap-x-6">
          <NavbarLink href="/games">Games</NavbarLink>
          <Search placeholder="Search Game" />
          {isPending ? (
            <div className="w-20 h-8 bg-surface animate-pulse rounded-md" />
          ) : session?.user ? (
            <div className="relative inline-block group text-sm">
              <div className="flex flex-row items-center">
                <img
                  src={imageUrl || DEFAULT_PROFILE_IMAGE}
                  alt="Profile"
                  className="w-7 h-7 object-cover rounded-full"
                />
                <p className="flex items-center px-1.5 py-2 text-left w-full">
                  {session?.user.name}{" "}
                  <IoIosArrowDown className="ml-0.5 mt-1.25 group-hover:-rotate-180 duration-200 transition-transform" />
                </p>
              </div>
              <div className="hidden group-hover:flex flex-col absolute pb-2 bg-surface rounded-sm z-10 whitespace-nowrap">
                <Link
                  href="/"
                  className="px-4 py-2 text-text-primary hover:text-white hover:bg-primary/70 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href={`/users/${session?.user.name}`}
                  className="px-4 py-2 text-text-primary hover:text-white hover:bg-primary/70 transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="px-4 py-2 text-text-primary hover:text-white hover:bg-primary/70 transition-colors"
                >
                  Settings
                </Link>

                <div className="border-b border-solid border-gray-500/50" />

                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 flex flex-row items-center text-text-primary hover:bg-primary/70 hover:text-white transition-colors cursor-pointer"
                >
                  Log out <IoIosLogOut className="ml-0.5 mt-1.25" />
                </button>
              </div>
            </div>
          ) : (
            <NavbarLink href="/login">Login</NavbarLink>
          )}
        </div>
      </div>
    </div>
  );
}
