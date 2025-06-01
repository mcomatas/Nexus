'use client'

//import { SignOut } from '../../ui/form';
import { signOut, SessionProvider } from 'next-auth/react';
import { auth } from '../../../auth';
import { useState, useEffect, use } from 'react';
import { prisma } from '../../../prisma';
import { GameCard } from '../../components/gamecard';
import Pagination from '../../ui/pagination';
import useSWR from 'swr';

interface Props {
    params: {
        username: string;
    };
}

const PAGE_SIZE = 32;

export default function Page({ params }) {
 
    const obj = use(params);
    const username = obj['username'];

    const fetcher = url => fetch(url).then(r => r.json());
    const { data, error, isLoading } = useSWR(`/api/users/${username}`, fetcher);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading games.</p>;

    const gamesArray = data.data.map((game) => 
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