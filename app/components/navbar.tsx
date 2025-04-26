import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../ui/global.css'
import { inter, rowdies } from '../ui/fonts'
import styled from 'styled-components'
import Search from '../ui/search'
import { auth } from '../../auth'
import { useState, useEffect } from 'react';
//import { useSession } from 'next-auth/react'
import { SignOut } from '../ui/form'

//have a Link Item here for more stylization than just Nextjs Link
/*const NavbarLink = styled(Link)`
    color: blue;
    text-decoration: none;
    &:hover {
        a {
            
        }
    }
`*/

const NavbarLink = ({href, children, ...props}) => {
    //const active = usePathname() === href
    return (
            <Link
                className='text-lg hover:bg-fuchsia-300 transition rounded-2xl p-2'
                href={href}
            >
                {children}
            </Link>
    )
}


export default async function Navbar() {        
    const session = await auth();
    //console.log(session);
    const name = session?.user.name;
    //console.log(session?.user.email);
    
    return (
        <div className="w-full bg-linear-to-t from-slate-500 from-20% to-gray-400 border-b border-gray-800">
            <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
                <Link href="/" className="text-2xl font-bold">Nexus</Link>
                <div className="flex justify-evenly items-center gap-x-6">
                    <NavbarLink href="/games">Games</NavbarLink>
                    <Search placeholder='Search Game'/>
                    {session?.user ? (<NavbarLink href={`/users/${session?.user.name}`}>Profile</NavbarLink>) : (<NavbarLink href="/login">Login</NavbarLink>)}
                </div>
            </div>
        </div>
    )
}