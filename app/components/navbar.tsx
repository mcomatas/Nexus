'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../ui/global.css'
import { inter, rowdies } from '../ui/fonts'
import styled from 'styled-components'

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
        <div className="container" style={rowdies.style}>
            <Link href="/"><h1>Nexus</h1></Link>
            <div className="menuItems">
                <LinkItem href="/games">Games</LinkItem>
                <p>Item2</p>
                <p>Item3</p>
                <p>{path}</p>
            </div>
        </div>
    )
}

export default Navbar