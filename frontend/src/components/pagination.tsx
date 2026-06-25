'use client';

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Pagination() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const limit = Math.max(Number(searchParams.get('limit')), 32);

  function handleClick() {
    const params = new URLSearchParams(searchParams);
    params.set('limit', String(limit + 32));
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div>
      <button
        className="bg-primary hover:bg-primary-dark transition-all cursor-pointer px-10 py-2 rounded-full"
        onClick={handleClick}
      >
        Load More
      </button>
    </div>
  )
}
