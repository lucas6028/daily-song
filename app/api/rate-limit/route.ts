// app/api/rate-limit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'redis';

// Create a Redis client
const redisClient = createClient({
  password: process.env.SECRET_REDIS_PASSWORD,
  socket: {
    host: 'redis-19705.c54.ap-northeast-1-2.ec2.redns.redis-cloud.com',
    port: 19705,
  },
});

redisClient.on('error', err => console.log('Redis Client Error', err));

// Ensure Redis client connects
(async () => {
  await redisClient.connect();
})();

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const now = Date.now();
  const requestsPerMinute = 60;
  const oneMinute = 60 * 1000;

  try {
    const data = await redisClient.get(ip);
    if (!data) {
      await redisClient.set(ip, JSON.stringify({ count: 1, lastReset: now }), {
        EX: 60,
      });
      return NextResponse.json({ message: 'Allowed' }, { status: 200 });
    } else {
      const { count, lastReset } = JSON.parse(data);
      if (now - lastReset > oneMinute) {
        await redisClient.set(ip, JSON.stringify({ count: 1, lastReset: now }), { EX: 60 });
        return NextResponse.json({ message: 'Allowed' }, { status: 200 });
      } else if (count > requestsPerMinute) {
        return NextResponse.json({ message: 'Too Many Requests' }, { status: 429 });
      } else {
        await redisClient.set(ip, JSON.stringify({ count: count + 1, lastReset }), { EX: 60 });
        return NextResponse.json({ message: 'Allowed' }, { status: 200 });
      }
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
