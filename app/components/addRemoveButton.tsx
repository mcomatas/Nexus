'use client'

import { useSession } from 'next-auth/react';
import { prisma } from '../../prisma';
import { useState, useEffect } from 'react';


export default function AddRemoveButton({ game }) {
    const { data: session, status } = useSession();
    const [played, setPlayed] = useState(false);

    useEffect(()  => {
        if (session?.user?.playedGames) {
            setPlayed(session.user.playedGames.includes(game.id));
        }
    }, [session])

    if (status === 'loading') return null;

    const handleAdd = async() => {
        if(!session?.user) {
            alert("You need to be signed in to add");
            return;
        }

        try {
            const res = await fetch('/api/users/addGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gameId: game.id,
                    email: session.user.email
                }),
            });
            const data = await res.json();
            console.log(data);
        } catch(error) {
            console.log(error);
        }
    }

    const handleRemove = async() => {
        try {
            const res = await fetch('/api/users/removeGame', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    gameId: game.id,
                    email: session.user.email
                })
            });
            const data = await res.json();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
        <button
            className='bg-fuchsia-200 text-gray-700 text-xl rounded-sm mr-auto pl-2 pr-2 pt-0.5 pb-0.5 hover:bg-fuchsia-400 transition-all cursor-pointer'
            onClick={played ? () => {
                handleRemove();
                setPlayed(!played);
            } : () => {
                handleAdd();
                setPlayed(!played);
            }}
        >
            {played ? '-' : '+'}
        </button>
    )
}