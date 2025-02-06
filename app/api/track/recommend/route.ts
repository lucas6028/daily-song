import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const artist = searchParams.get('seed_artist') || 'Coldplay';
  const track = searchParams.get('seed_track') || 'Yellow';
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const autoCorrect = searchParams.get('autocorrect') || '0';
  const API_KEY = process.env.SECRET_LASTFM_API_KEY;

  const url = `https://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&limit=${limit}&autocorrect=${autoCorrect}&api_key=${API_KEY}&format=json`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log('similar track: ');

    return NextResponse.json({ tracks: data.similartracks.track, status: 200 });
  } catch (err) {
    console.error('Error while get recommend tracks: ' + err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
