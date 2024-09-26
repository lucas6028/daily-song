// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_NODE_ENV === 'development') return NextResponse.next();

  const ip = request.ip ?? '127.0.0.1';

  const rateLimitApiUrl = new URL('/api/rate-limit', request.url);

  const response = await fetch(rateLimitApiUrl.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ip }),
  });

  if (response.status === 429) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
