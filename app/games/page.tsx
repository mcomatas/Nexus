'use client'

import Link from 'next/link';
import { GameCard } from '../components/gamecard'
//import getAccessToken from '../lib/getAccessToken'
import getGames from '../lib/getGames';
import Pagination from '../ui/pagination';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Creates GameCard components 
function makeRow(games) {
    const row = games.map((game) => 
        <li key={game.id}>
            <GameCard src={game.cover ? "https:" + game.cover.url.replace("t_thumb", "t_720p") : "/default-cover.webp"} alt={game.slug} slug={game.slug}/>
        </li>
    )
    return row;
}

export default function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: number;
    }>;
}) {

    const [games, setGames] = useState([]);
    const [count, setCount] = useState(0);
    /*const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const page = searchParams?.page || 1;*/

    //console.log(searchParams);
    //console.log(query);
    //console.log(page)

    //const { games, count } = await getGames(query, page);
    useEffect(() => {
        async function fetchGames() {
            try {
                const searchParams = await props.searchParams;
                //console.log('search params: ', searchParams);
                const query = searchParams?.query || '';
                const page = searchParams?.page || 1;
                const res = await fetch(`/api/games?query=${query}&page=${page}`);
                const data = await res.json();
                //console.log(data.games);
                setGames(data.games);
                setCount(data.count);
                //console.log(games);
                //console.log(data);
                //const data = await res.json();
                //console.log(data);
            } catch (error) {
                console.log("Error fetching games: ", error);
            }
        }
        fetchGames();
    }, [props]);

    if (!games || !count) return <p>Loading...</p>
    //const res = await fetch("/api/games");
    //console.log(res);
    //console.log(count);

    const gamesArray = games.map((game) => 
        <div key={game.id}>
            <GameCard src={game.cover ? "https:" + game.cover.url.replace("t_thumb", "t_720p") : "/default-cover.webp"} alt={game.slug} slug={game.slug}/>
        </div>
    )

    //const data2d = [];
    //console.log(games[0]);
    // I think this will have to be changed later for mobile viewing
    /*while (games.length) data2d.push(games.splice(0,4)); // Make a 2D array with rows fo length 4
    const gamesArray = data2d.map((row, index) => 
        <div className='main' key={index}>
            {makeRow(row)}
        </div>
    )*/

    return (
        <div>
            <h1 className="flex max-w-4/5 mx-auto text-md pt-2">Games</h1>
            <div className='border-b border-solid w-4/5 mx-auto'/>
            <div className="grid grid-cols-4 gap-2 pt-4 place-items-center max-w-4/5 mx-auto">
                {gamesArray}
            </div>

            {/*Pagination Controls*/}
            {<Pagination totalCount={count}/>}
        </div>
    )
}