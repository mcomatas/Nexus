import Link from "next/link";
// import { usePathname } from 'next/navigation'
import "../ui/global.css";
import { inter, rowdies } from "../ui/fonts";
import styled from "styled-components";
import Search from "../ui/search";
import { auth } from "../../auth";
// import { useState, useEffect } from 'react';
//import { FaAngleDown, FaChevronDown } from 'react-icons/fa';
// import { FaChevronDown } from 'react-icons/fa6'
import { IoIosArrowDown } from "react-icons/io";

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
      className={`text-md hover:bg-gray-600/70 transition rounded-md px-3 py-2 ${className}`}
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
    <div className="w-full bg-navbar-glass text-text-primary sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
        <Link href="/" className="text-2xl font-bold">
          Nexus
        </Link>
        <div className="flex justify-evenly items-center gap-x-6">
          <NavbarLink href="/games">Games</NavbarLink>
          <Search placeholder="Search Game" />
          {session?.user ? (
            <div className="relative inline-block group text-sm">
              <div className="hidden group-hover:flex flex-col absolute pb-2 bg-gray-400 rounded-sm z-10">
                <div className="flex items-center px-4 py-2 mb-2 text-left w-full group-hover:text-white border-b border-solid border-gray-500/50">
                  {session?.user.name}{" "}
                  <IoIosArrowDown className="ml-0.5 mt-1.25" />
                </div>

                <Link
                  href="/"
                  className="px-4 py-2 text-gray-700 hover:text-white hover:bg-gray-500"
                >
                  Home
                </Link>
                <Link
                  href={`/users/${session?.user.name}`}
                  className="px-4 py-2 text-gray-700 hover:text-white hover:bg-gray-500"
                >
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className="px-4 py-2 text-gray-700 hover:text-white hover:bg-gray-500"
                >
                  Settings
                </Link>
              </div>

              <p className="flex items-center px-4 py-2 text-left w-full">
                {session?.user.name}{" "}
                <IoIosArrowDown className="ml-0.5 mt-1.25" />
              </p>
            </div>
          ) : (
            <NavbarLink href="/login">Login</NavbarLink>
          )}
        </div>
      </div>
    </div>
  );
}
