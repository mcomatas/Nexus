import Link from 'next/link';
import { GameCard } from '../components/gamecard'
import getAccessToken from '../lib/getAccessToken'
import getGames from '../lib/getGames';

// Creates GameCard components 
function makeRow(games) {
    const row = games.map((game) => 
        <li key={game.id}><GameCard src={game.cover ? "https:" + game.cover.url.replace("t_thumb", "t_720p") : "/default-cover.webp"} alt={game.slug} slug={game.slug}/></li>
    )
    return row;
}

export default async function Page() {
    const data = await getGames();
    const data2d = [];
    // I think this will have to be changed later for mobile viewing
    while (data.length) data2d.push(data.splice(0,4)); // Make a 2D array with rows fo length 4
    const games = data2d.map((row, index) => 
        <div className='main' key={index}>
            {makeRow(row)}
        </div>
    )

    return (
        <div>
            <h1>Games page</h1>
            {games}       
        </div>
    )
}