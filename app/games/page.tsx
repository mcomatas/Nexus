import Link from 'next/link';
import { GameCard } from '../components/gamecard'

const params = {
    'client_id': process.env.IGDB_CLIENT_ID,
    'client_secret': process.env.IGDB_CLIENT_SECRET,
    'grant_type': 'client_credentials'
}

// Function to get bearer access token
async function getAccessToken() {
    try {
        const token_response = await fetch("https://id.twitch.tv/oauth2/token", {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'content-type': 'application/json'
            }
        });
        
        if (!token_response.ok) {
            throw new Error(`Response status: ${token_response.status}`);
        }

        let data = await token_response.json();
        return data.access_token;
        
    } catch (error) {
        console.log(error.message);
    }
}

// Function to use the bearer access token and get a response from IGDB
async function getData() {
    const access_token = await getAccessToken();
    try {
        const response = await fetch("https://api.igdb.com/v4/covers", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Client-ID': params.client_id,
                'Authorization': `Bearer ${access_token}`
            },
            body: "fields game,url,height,width; limit 10;"
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return response.json();

    } catch (error) {
        console.log(error.message);
    }
}

function makeRow(games) {
    const row = games.map((game) => 
        <li key={game.id}><GameCard src={"https:" + game.url.replace("t_thumb", "t_cover_big")} alt="Game Cover"/></li>
    )
    return row;
}

export default async function Page() {
    const data = await getData();
    const data2d = [];
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