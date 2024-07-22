'use client'

import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'

const GameItem = styled(Image)`
    border: solid 2px black;
    border-radius: 15px;
`

export const GameCard = ({src, alt, slug}) => {
    return (
        <Link href={`/games/${slug}`}>
            <GameItem src={src} alt={alt} height={350} width={263} quality={100} />
        </Link>
    )
}