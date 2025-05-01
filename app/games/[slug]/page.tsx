'use client'

import getGameData from "../../lib/getGameData"
import { GameCard } from "../../components/gamecard";
import { ImageModal } from '../../components/imageModal'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { useSession, SessionProvider } from 'next-auth/react'; 
import AddRemoveButton from '../../components/addRemoveButton'

export default function Page({ params }) {
    const obj = use(params);
    const slug = obj['slug'];   

    //const game = await getGameData(slug);
    const [game, setGame] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        async function fetchGame() {
            try {
                const res = await fetch(`/api/games/${slug}`);
                const data = await res.json();
                setGame(data[0]);
            } catch (error) {
                console.log("Error fetching game:", error)
            }
        }
        fetchGame();
    }, []);

    /*useEffect(() => {
        async function getUser() {
            try {
                //const session = await auth();
                //if (!session) return;
                //setUser(session.user);
            } catch (error) {
                console.log("Error: ", error);
            }
        }
    })*/

    if (!game) return <p>Loading...</p>
    
    // Some games might not have involved_companies returned. This would result
    // in undefined and an error. Need to be careful of this in the future.
    const developersFiltered = game.involved_companies.filter((company) => company.developer);
    const publishersFiltered = game.involved_companies.filter((company) => company.publisher);

    const CompanyGenerator = (companyArray, name) => {
        return (
            <div className="flex flex-row space-x-2 text-sm">
                <h3 className="font-semibold">{name}</h3>
                {companyArray.map((company, index) => (
                    <span key={company.id}>
                        {company.company.name}
                        {index < companyArray.length - 1 && ', '}
                    </span>
                ))}
            </div>
        )
    }

    const developers = CompanyGenerator(developersFiltered, "Developers:");
    const publishers = CompanyGenerator(publishersFiltered, "Publishers:");

    return (
        <div>
            {/*{game[0].artworks[0].url}*/}
            {game.artworks && 
                <div className="flex flex-col h-100 items-center relative">
                    <Image src={'https:' + game.artworks[0].url.replace('t_thumb', 't_1080p')} alt={String(slug)} layout="fill" style={{ objectFit: 'cover', objectPosition: 'center 20%' }} quality={100}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-600 from-10% to-transparent to-50%"/>
                </div>
            }
            <div className={`flex flex-row max-w-3/5 mx-auto ${game.artworks && '-mt-15'} p-2 relative`}>
                <div className='flex flex-col space-y-2'>
                    <ImageModal 
                        thmb={game.cover ? "https:" + game.cover.url.replace("t_thumb", "t_720p") : "/default-cover.webp"}
                        full={game.cover ? "https:" + game.cover.url.replace("t_thumb", "1080p") : "/default-cover.webp"}
                    />
                    <SessionProvider>
                        <AddRemoveButton game={game}/>
                    </SessionProvider>
                </div>
                <div className="flex flex-col min-h-screen mx-auto max-w-3/5 p-3">
                    <h1 className="text-3xl font-bold">{game.name}</h1>
                    {developers}
                    {publishers}
                    <br />
                    <br />
                    <p 
                        className={`text-sm ${expanded ? 'line-clamp-none': 'line-clamp-8'}`}
                    >
                        {game.storyline || game.summary}
                    </p>
                    <br />
                    <button 
                        onClick={() => setExpanded(!expanded)}className="text-xs ml-auto hover:underline"
                    >
                        {expanded ? 'Read Less' : 'Read More'}
                    </button>
                </div>
            </div>
        </div>
    )
}