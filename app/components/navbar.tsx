'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../ui/global.css'
import { inter, rowdies } from '../ui/fonts'
import styled from 'styled-components'
import Search from '../ui/search'

//have a Link Item here for more stylization than just Nextjs Link
const NavbarLink = styled(Link)`
    color: blue;
    text-decoration: none;
    &:hover {
        a {
            
        }
    }
`

const LinkItem = ({href, children, ...props}) => {
    const active = usePathname() === href
    //const path = usePathname()
    return (
        <NavbarLink
            href={href}
        >
            {children}
        </NavbarLink>
    )
}


const Navbar = () => {
    const path = usePathname()
    
    return (
        <div className="flex justify-evenly items-center max-w-2/5 mx-auto p-2">
            <Link href="/" className="text-xl"><h1>Nexus</h1></Link>
            <div className="flex justify-evenly items-center gap-x-5">
                <LinkItem href="/games">Games</LinkItem>
                <Search placeholder='Search Game'/>
                <p>{path}</p>
            </div>
        </div>
    )
}

export default Navbar