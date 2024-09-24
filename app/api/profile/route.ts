import { NextRequest, NextResponse } from 'next/server';
import spotifyAPI from 'config/spotifyConfig';

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get('access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Access token is missing' }, { status: 401 });
  }

  spotifyAPI.setAccessToken(accessToken);

  try {
    const data = await spotifyAPI.getMe();
    const response = NextResponse.json(data);
    return response;
  } catch (err) {
    console.error('Error while get profile: ' + err);
  }
}
