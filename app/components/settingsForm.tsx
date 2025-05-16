'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { SignIn } from '../ui/form';

export default function SettingsForm() {
    const { data: session, status } = useSession();
    const [newUsername, setNewUsername] = useState(session?.user.name);
    const [newEmail, setNewEmail] = useState(session?.user.email);

    if( status === 'unauthenticated') {
        return <div>You must be logged in to view this page</div>;
    }

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const res = await fetch('/api/users/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: session?.user.id,
                    newUsername,
                    newEmail
                })
            });

            const data = await res.json();
            console.log(data);
            alert(data.message);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
        >
            <div className="flex flex-col space-y-4 w-4/5 mx-auto">
                <div className="flex flex-col">
                    <label>
                        Username:
                    </label>
                    <input
                        type="text"
                        name="username"
                        defaultValue={session?.user.name}
                        className="bg-gray-100 text-gray-700 rounded-sm p-1 w-1/2 min-w-45"
                        onChange={(e) => setNewUsername(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label>
                        Email:
                    </label>
                    <input
                        type="email"
                        name="email"
                        defaultValue={session?.user.email}
                        className="bg-gray-100 text-gray-700 rounded-sm p-1 w-1/2 min-w-45"
                        onChange={(e) => setNewEmail(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    className='bg-fuchsia-200 text-gray-800 w-30 mt-5 rounded-md'
                >
                    Save Changes
                </button>       
            </div>
        </form>
    )
}