import { NextRequest, NextResponse } from 'next/server';
import spotifyAPI from 'config/spotifyConfig';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        {
          message: 'Access token is missing',
          status: 401,
        },
        { status: 401 }
      );
    }

    spotifyAPI.setAccessToken(accessToken);
    const data = await spotifyAPI.getMyTopTracks({ limit: limit });
    return NextResponse.json(data);
  } catch (err) {
    console.error('Error while getting my top tracks: ', err);
    return NextResponse.json({ message: 'An error occurred', status: 500 }, { status: 500 });
  }
}
