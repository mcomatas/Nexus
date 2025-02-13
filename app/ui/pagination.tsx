'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function Pagination() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const currentPage = Number(searchParams.get('page')) || 1;

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    }

    const previousPage = () => {
        const url = createPageURL(currentPage - 1);
        replace(url);
    }
    
    const nextPage = () => {
        const url = createPageURL(currentPage + 1)
        replace(url);
    }

    return (
        <div>
            <button onClick={previousPage}>Previous</button>
            <button onClick={nextPage}>Next</button>
        </div>
    )

}