import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const seed_artist = searchParams.get('seed_artist') || '周杰倫';
    const limit = searchParams.get('limit') || 10;
    const apiKey = process.env.SECRET_LASTFM_API_KEY;

    const url = `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${seed_artist}&limit=${limit}&api_key=${apiKey}&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json({ artists: data.similarartists.artist, status: 200 });
  } catch (err) {
    console.error('Error while get related artist: ' + err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
