'use client'

import Link from 'next/link'
import Image from 'next/image'
import styled from 'styled-components'

const GameItem = styled(Image)`
    border: solid 2px grey;
    border-radius: 10px;
`

export const GameCard = ({src, alt}) => {
    return (
        <GameItem src={src} alt={alt} width={250} height={275} />
    )
}