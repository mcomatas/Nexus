'use client'

import { use } from 'react';
//import { SignOut } from '../../ui/form';
import { signOut, SessionProvider } from 'next-auth/react';
import { auth } from '../../../auth';
import { useState, useEffect } from 'react';
import { prisma } from '../../../prisma';
import { GameCard } from '../../components/gamecard';

interface Props {
    params: {
        username: string;
    };
}

export default function Page({ params }) {
    //const { username } = await params;


    
    const obj = use(params);
    //console.log(obj);
    const username = obj['username'];
    //const email = obj['email'];
    //console.log(username);
    const [games, setGames] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchGames() {
            const response = await fetch('/api/users/getGames', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username
                })
            });
            const data = await response.json();
            setGames(data['data'].games);
            setCount(data['data'].count);
        }
        fetchGames();
    }, [username]);

    if (!games || !count) return <p>Loading...</p>

    const gamesArray = games.map((game) => 
        <div key={game.id}>
            <GameCard src={game.cover ? "https:" + game.cover.url.replace("t_thumb", "t_720p") : "/default-cover.webp"} alt={game.slug} slug={game.slug}/>
        </div>
    );

    return (
        <div>
            Hello {username}.
            <br />
            <div className="grid grid-cols-4 gap-2 pt-4 place-items-center max-w-4/5 mx-auto">
                {gamesArray}
            </div>
            <br />
            <button 
                onClick={() => signOut()}
                className="bg-fuchsia-200 text-gray-800 rounded-sm p-1"
            >
                Sign Out
            </button>
        </div>
    )
}