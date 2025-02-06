import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get('page') || '20', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const API_KEY = process.env.SECRET_LASTFM_API_KEY;

  const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&api_key=${API_KEY}&limit=${limit}&page=${page}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return NextResponse.json({ tracks: data.tracks.track, status: 200 });
  } catch (err) {
    console.error('Error while get recommend tracks: ' + err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
