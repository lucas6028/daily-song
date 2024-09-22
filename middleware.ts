import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This is a simple in-memory store. For production, use a more robust solution.
const ipRequests = new Map<string, { count: number; lastReset: number }>();

export function middleware(request: NextRequest) {
  const ip = request.ip ?? "127.0.0.1";
  const now = Date.now();
  const requestsPerMinute = 60;
  const oneMinute = 60 * 1000;

  console.log("Middleware running!");

  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, { count: 1, lastReset: now });
  } else {
    const data = ipRequests.get(ip)!;
    if (now - data.lastReset > oneMinute) {
      data.count = 1;
      data.lastReset = now;
    } else if (data.count > requestsPerMinute) {
      return new NextResponse("Too Many Requests", { status: 429 });
    } else {
      data.count++;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
