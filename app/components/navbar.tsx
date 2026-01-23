import Link from "next/link";
// import { usePathname } from 'next/navigation'
import "../ui/global.css";
import styled from "styled-components";
import Search from "../ui/search";
import { auth } from "../../auth";
// import { useState, useEffect } from 'react';
//import { FaAngleDown, FaChevronDown } from 'react-icons/fa';
// import { FaChevronDown } from 'react-icons/fa6'
import { IoIosArrowDown } from "react-icons/io";
import { IoIosLogOut } from "react-icons/io";

//import { useSession } from 'next-auth/react'
//import { SignOut } from '../ui/form'
import { signOut } from "../../auth";

//have a Link Item here for more stylization than just Nextjs Link
/*const NavbarLink = styled(Link)`
    color: blue;
    text-decoration: none;
    &:hover {
        a {

        }
    }
`*/

const NavbarLink = ({ href, children, className = "", ...props }) => {
  //const active = usePathname() === href
  return (
    <Link
      className={`text-md hover:bg-primary/30 transition rounded-md px-3 py-2 ${className}`}
      href={href}
    >
      {children}
    </Link>
  );
};

export default async function Navbar() {
  const session = await auth();
  //console.log(session);
  //const name = session?.user.name;
  //console.log(session?.user.email);

  return (
    <div className="w-full bg-navbar-glass text-text-primary sticky top-0 z-50 font-heading">
      <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
        <Link href="/" className="text-2xl font-bold">
          Nexus
        </Link>
        <div className="flex justify-evenly items-center gap-x-6">
          <NavbarLink href="/games">Games</NavbarLink>
          <Search placeholder="Search Game" />
          {session?.user ? (
            <div className="relative inline-block group text-sm">
              <p className="flex items-center px-4 py-2 text-left w-full">
                {session?.user.name}{" "}
                <IoIosArrowDown className="ml-0.5 mt-1.25 group-hover:-rotate-180 duration-200 transition-transform" />
              </p>
              <div className="hidden group-hover:flex flex-col absolute pb-2 bg-surface rounded-sm z-10">
                {/*<div className="flex items-center px-4 py-2 mb-2 text-left w-full group-hover:text-text-primary border-b border-solid border-gray-500/50">
                  {session?.user.name}
                  <IoIosArrowDown className="ml-0.5 mt-1.25" />
                  </div>*/}

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
                  onClick={async () => {
                    "use server";
                    await signOut();
                  }}
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
