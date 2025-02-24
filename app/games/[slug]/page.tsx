import getGameData from "../../lib/getGameData"
import { GameCard } from "../../components/gamecard";

export default async function Page({params: {slug}}) {
    const game = await getGameData(slug);
    //console.log(game[0]);
    //console.log(game[0].name);
    return (
        <div className="gameContainer">
            <GameCard src={game[0].cover ? "https:" + game[0].cover.url.replace("t_thumb", "t_720p") : "/default-cover.webp"} alt={game[0].slug} slug={game[0].slug}/>
            <div>
                {game[0].name}
                <br />
                <br />
                {game[0].storyline || game[0].summary}
            </div>
        </div>
    )
}