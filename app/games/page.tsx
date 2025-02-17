import Link from 'next/link';
import { GameCard } from '../components/gamecard'
//import getAccessToken from '../lib/getAccessToken'
import getGames from '../lib/getGames';
import Pagination from '../ui/pagination';

// Creates GameCard components 
function makeRow(games) {
    const row = games.map((game) => 
        <li key={game.id}>
            <GameCard src={game.cover ? "https:" + game.cover.url.replace("t_thumb", "t_720p") : "/default-cover.webp"} alt={game.slug} slug={game.slug}/>
        </li>
    )
    return row;
}

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: number;
    }>;
}) {

    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const page = searchParams?.page || 1;

    //console.log(searchParams);
    //console.log(query);
    //console.log(page)

    const { games, count } = await getGames(query, page);
    //console.log(count);
    const data2d = [];
    // I think this will have to be changed later for mobile viewing
    while (games.length) data2d.push(games.splice(0,4)); // Make a 2D array with rows fo length 4
    const gamesArray = data2d.map((row, index) => 
        <div className='main' key={index}>
            {makeRow(row)}
        </div>
    )

    return (
        <div>
            <h1>Games page</h1>
            {gamesArray} 

            {/*Pagination Controls*/}
            <Pagination totalCount={count}/>
        </div>
    )
}