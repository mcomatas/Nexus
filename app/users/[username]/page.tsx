'use client'

import { use } from 'react';
//import { SignOut } from '../../ui/form';
import { signOut, SessionProvider } from 'next-auth/react';
import { auth } from '../../../auth';
import { useState, useEffect } from 'react';
import { prisma } from '../../../prisma';
import { GameCard } from '../../components/gamecard';
import Pagination from '../../ui/pagination';

interface Props {
    params: {
        username: string;
    };
}

const PAGE_SIZE = 32;

//`fields name, slug, cover.url; where id = (${ids.join(',')}); limit 20;`
//const page = searchParams?.page || 1;
//const offset = (page - 1) * PAGE_SIZE;
//const bodyMain = `fields name, slug, cover.url; where cover != null & game_type = (0,8); limit ${PAGE_SIZE}; offset ${offset};`
/*const body = query.length > 0 
            ? `search "${query}"; ${bodyMain}`
            : `${bodyMain} sort total_rating_count desc;`;*/

export default function Page({ params }) {
    //const { username } = await params;

    //const page = searchParams?.page || 1;
    //const offset = (page - 1) * PAGE_SIZE;
    //const bodyMain = `fields name, slug, cover.url; where cover != null & game_type = (0,8); limit ${PAGE_SIZE}; offset ${offset};`

    
    const obj = use(params);
    //console.log(obj);
    const username = obj['username'];
    //const email = obj['email'];
    //console.log(username);
    const [games, setGames] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchGames() {
            //const searchParams = await props.searchParams;
            //const page = searchParams?.page || 1;
            //const offset = (page - 1) * PAGE_SIZE;
            //const body = `fields name, slug, cover.url; where cover != null & game_type = (0,8); limit ${PAGE_SIZE}; offset ${offset};`

            
            const response = await fetch('/api/users/getGames', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
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
            {/*
                Leavin pagination out for now. Currently displaying all games a user has played on their profile.
                <Pagination totalCount={count} />
            */}
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