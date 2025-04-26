import Link from 'next/link';
import { auth } from '../auth';
import { prisma } from '../prisma'

export default async function Page() {
    const session = await auth();

    //console.log(session);
    //console.log(session?.user?.email);
    
    return (
        <div className="flex flex-col mx-auto p-5">
            <h1 className="text-2xl">Welcome to the Nexus homepage!</h1>
        </div>
    )
}