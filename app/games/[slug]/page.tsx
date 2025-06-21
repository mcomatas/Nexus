'use client'

import { ImageModal } from '../../components/imageModal'
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { use } from 'react';
import { SessionProvider } from 'next-auth/react'; 
import ReviewForm from "../../components/reviewForm";
import useSWR from "swr";

export default function Page({ params }) {
    const obj = use(params);
    const slug = obj['slug'];   

    const [expanded, setExpanded] = useState(false);

    const fetcher = url => fetch(url).then(res => res.json());
    const { data: game, error: gameError, isLoading: gameLoading } = useSWR(`/api/games/${slug}`, fetcher);
    const { data: reviewsAndRating, error: reviewsError, isLoading: reviewsLoading } = useSWR(`/api/review/${slug}/get`, fetcher);
   
    if (gameLoading) return <p>Loading...</p>;
    if (gameError) return <p>Error loading game.</p>;
    
    // Some games might not have involved_companies returned. This would result
    // in undefined and an error. Need to be careful of this in the future.
    const developersFiltered = game.involved_companies?.filter((company) => company.developer);
    const publishersFiltered = game.involved_companies?.filter((company) => company.publisher);

    const CompanyGenerator = (companyArray, name) => {
        return (
            <div className="text-sm">
                <h3 className="font-semibold inline pr-2">{name}</h3>
                {companyArray?.map((company, index) => (
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
                <div className="flex flex-col h-130 items-center relative">
                    <Image src={'https:' + game.artworks[0].url.replace('t_thumb', 't_1080p')} alt={String(slug)} layout="fill" style={{ objectFit: 'cover', objectPosition: 'center 20%' }} quality={100}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-600 from-10% to-transparent to-50%"/>
                </div>
            }
            <div className={`flex flex-row max-w-7/10 min-h-[500px] mx-auto ${game.artworks && '-mt-25'} p-2 relative`}>
                <div>
                    <ImageModal 
                        thmb={game.cover ? "https:" + game.cover.url.replace("t_thumb", "t_720p") : "/default-cover.webp"}
                        full={game.cover ? "https:" + game.cover.url.replace("t_thumb", "1080p") : "/default-cover.webp"}
                    />
                    <p className="font-semibold text-2xl">{reviewsAndRating?.avg._avg.rating}</p>
                </div>
                <div className="flex flex-col mx-auto max-w-3/5 p-4">
                    <h1 className="text-3xl font-bold text-white">{game.name}</h1>
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
                <div>
                    <SessionProvider>
                        <ReviewForm game={game} />
                    </SessionProvider>
                </div>
            </div>
            <div className="flex flex-col max-w-3/5 mx-auto p-2">
                <h3>Reviews:</h3>
                <span className="border-b w-[100%] border-solid mx-auto"/>
                {reviewsAndRating?.reviews.length ? (
                    <div>
                        {reviewsAndRating.reviews.map((review) => (
                            <div key={review.id} className="p-2">
                                <div className="flex flex-col space-y-2">
                                    <div className="flex flex-row justify-between">
                                        <h3 className="text-sm font-semibold">{review.user.name}</h3>
                                        <p className="text-sm">{review.rating}</p>
                                    </div>
                                    <div className="text-sm">
                                        {review.reviewText}
                                    </div>
                                </div>
                                <div className="border-b w-[100%] border-gray-700 border-solid mx-auto p-2"/>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-sm p-2'>
                        No reviews yet
                    </p>
                )}
            </div>
        </div>
    )
}