import Link from 'next/link'
import Image from 'next/image'
//import styled from 'styled-components'

/* const GameItem = styled(Image)`
    border: solid 2px black;
    border-radius: 15px;
`*/

export const GameCard = ({src, alt, slug}) => {
    return (
        <Link href={`/games/${slug}`}>
            <Image className="rounded-lg border-black border-solid border-2 aspect-9/12 hover:border-gray-200 hover:border-4 transition-all" src={src} alt={alt} height={350} width={263} quality={100} />
        </Link>
    )
}