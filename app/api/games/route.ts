import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    return new Response('Hello from route');
}