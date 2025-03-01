'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    
    //This handles search for every key stroke with debouncing
    /*const handleSearch = useDebouncedCallback((term) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1')
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
        //console.log(term);
    }, 500);*/

    //This handles search based on hitting the 'Enter' key
    const handleSearch = ((term) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        params.set('query', term);
        replace(`/games?${params.toString()}`);
    });

    const onKeyDown = (e) => {
        if(e.key === "Enter") {
            handleSearch(e.target.value);
            e.target.value = ""; // Make search bar return to empty string after hitting enter
        }
    }

    return (
        <div>
            <input 
                placeholder={placeholder}
                /*onChange={(e) => {
                    handleSearch(e.target.value);
                }}*/
                className="bg-gray-100 rounded-lg p-1 border-1 border-zinc-700 text-sm text-gray-700"
                onKeyDown={(e) => onKeyDown(e)}
                defaultValue={searchParams.get('query')?.toString()}
            />
        </div>
    )
}