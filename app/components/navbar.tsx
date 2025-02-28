'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../ui/global.css'
import { inter, rowdies } from '../ui/fonts'
import styled from 'styled-components'
import Search from '../ui/search'

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
    const active = usePathname() === href
    //const path = usePathname()
    return (
            <Link
                className='text-lg txt-gray-700'
                href={href}
            >
                {children}
            </Link>
    )
}


const Navbar = () => {
    const path = usePathname()
    
    return (
        <div className="w-full bg-gray-200 border-b border-gray-400">
            <div className="flex justify-between items-center max-w-4xl mx-auto p-4">
                <Link href="/" className="text-2xl font-bold text-gray-700"><h1>Nexus</h1></Link>
                <div className="flex justify-evenly items-center gap-x-6">
                    <NavbarLink href="/games">Games</NavbarLink>
                    <Search placeholder='Search Game'/>
                    <p>{path}</p>
                </div>
            </div>
        </div>
    )
}

export default Navbar