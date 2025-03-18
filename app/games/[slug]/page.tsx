'use client'

import getGameData from "../../lib/getGameData"
import { GameCard } from "../../components/gamecard";
import { ImageModal } from '../../components/imageModal'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { use } from 'react';

export default function Page({ params }) {
    const obj = use(params);
    const slug = obj['slug'];
    //console.log(slug['slug'], typeof(slug));

    //console.log(typeof(slug));    
    //const game = await getGameData(slug);
    //console.log(gameData);
    const [game, setGame] = useState(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        async function fetchGame() {
            try {
                const res = await fetch(`/api/games/${slug}`);
                const data = await res.json();
                //console.log(data[0]);
                setGame(data[0]);
                //console.log(game);
                //console.log(await res.json());
                //const data = await res.json();
                //console.log(data);
                //console.log(data.message);
            } catch (error) {
                console.log("Error fetching game:", error)
            }
        }
        fetchGame();
    }, [slug]);

    if (!game) return <p>Loading...</p>

    //const art = Math.floor(Math.random() * game.artworks.length);


    //console.log("game", typeof(game), game);
    //const game = await getGameData(slug);
    //console.log(game[0]);
    //console.log(game[0].name);
    //className="flex flex-col max-w-1080 h-100 z-0 items-center relative"
    return (
        <div>
            {/*{game[0].artworks[0].url}*/}
            {game.artworks && 
                <div className="flex flex-col h-100 items-center relative">
                    <Image src={'https:' + game.artworks[0].url.replace('t_thumb', 't_1080p')} alt={String(slug)} layout="fill" style={{ objectFit: 'cover', objectPosition: 'center 20%' }} quality={100}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-500 from-10% to-transparent to-50%"/>
                </div>
            }
            <div className={`flex flex-row max-w-3/5 mx-auto ${game.artworks && '-mt-15'} p-2 relative`}>
                <ImageModal 
                    thmb={game.cover ? "https:" + game.cover.url.replace("t_thumb", "t_720p") : "/default-cover.webp"}
                    full={game.cover ? "https:" + game.cover.url.replace("t_thumb", "1080p") : "/default-cover.webp"}
                />
                <div className="flex flex-col min-h-screen mx-auto max-w-3/5 p-3">
                    <h1 className="text-2xl">{game.name}</h1>
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