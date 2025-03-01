'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { PAGE_SIZE } from '../lib/getGames';

export default function Pagination({ totalCount }: { totalCount: number }) {
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

    const setPage = (page: number) => {
        const url = createPageURL(page);
        replace(url);
    }

    const maxPageButtons = 7;
    const totalPages = Math.ceil(totalCount / PAGE_SIZE);
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    //Adjust range if near the end
    if (endPage - startPage < maxPageButtons - 1) {
        startPage = Math.max(1, endPage - maxPageButtons - 1);
    }

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    if (pages[0] !== 1) pages.unshift(1); // Add 1 to the beginning of pages array if it's not in
    if (pages[pages.length-1] !== totalPages && pages.length > 1) pages.push(totalPages); // Add last page to the end of the pages array if it's not in
    
    //const buttonStyle = `w-22 rounded-md bg-zinc-500`;

    const prevDisabled = currentPage === 1;
    const nextDisabled = currentPage === totalPages;

    return (
        <div className="flex flex-row justify-evenly max-w-4/5 mx-auto p-10">
            
            <button 
                className={`rounded-md w-22 bg-fuchsia-300 hover:bg-fuchsia-500 transition disabled:bg-zinc-500`} 
                disabled={prevDisabled} 
                onClick={previousPage}
            >
                Previous
            </button>
            {/*{currentPage > 1 + 3 && <button className='rounded-md h-10 w-20 bg-zinc-300' onClick={() => setPage(1)}>1</button>}*/}
            {pages.map((num) => (
                <button 
                    key={num}
                    className={`rounded-md h-10 w-20 ${currentPage === num ? 'bg-fuchsia-300' : 'bg-zinc-300'} hover:bg-fuchsia-500 transition`} 
                    onClick={() => setPage(num)}
                >
                    {num}
                </button>
            ))}
            {/*{currentPage < totalPages - 3 && <button className='rounded-md h-10 w-20 bg-zinc-300' onClick={() => setPage(totalPages)}>{totalPages}</button>}*/}
            <button
                className={`rounded-md w-22 bg-fuchsia-300 hover:bg-fuchsia-500 transition disabled:bg-zinc-500`}
                disabled={nextDisabled}    
                onClick={nextPage}
            >
                Next
            </button>


            {/* Old button format */}
            {/*{currentPage > 1 && <button onClick={previousPage}>Previous</button>}
            {currentPage > 1 + 3 && <button onClick={() => setPage(1)}>1</button>}
            {pages.map((num) => (
                <button key={num} onClick={() => setPage(num)}>{num}</button>
            ))}
            {currentPage < totalPages - 3 && <button onClick={() => setPage(totalPages)}>{totalPages}</button>}
            {currentPage < totalPages && <button onClick={nextPage}>Next</button>}*/}
        </div>
    )

}