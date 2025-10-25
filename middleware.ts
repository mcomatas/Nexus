import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone(); // The current URL request. Then make a copy of it so we can modify it.
    const { pathname } = request.nextUrl; // This is just the path name after the doman (/users/username)

    //Ignore API routes under /users/api/*
    if (pathname.startsWith('/users/api/')) {
        return NextResponse.next();
    }

    // Only apply to /users/:username path and optional other username sub paths
    const match = pathname.match(/^\/users\/([^\/]+)(\/.*)?$/);
    if (!match) return NextResponse.next();

    const username = match[1];
    const lower = username.toLowerCase();

    if (username !== lower) {
        url.pathname = pathname.replace(`/users/${username}`, `/users/${lower}`);
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/users/:path*'],
}