import { NextRequest, NextResponse } from 'next/server';
import spotifyAPI from 'config/spotifyConfig';

// check authentication
// 1. check access token in the cookie?
// 2. check refresh token in the cookie?
// 3. redirect user to login page
export async function GET(req: NextRequest) {
  const cookieStore = req.cookies;
  const accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (accessToken) {
    // Access token exists, assume it's valid
    return NextResponse.json({
      authenticated: true,
      message: 'Access token is present',
    });
  }

  if (refreshToken) {
    // No access token, but refresh token exists, so refresh the access token
    try {
      spotifyAPI.setRefreshToken(refreshToken);
      const data = await spotifyAPI.refreshAccessToken();
      const newAccessToken = data.body['access_token'];
      const expiresIn = data.body['expires_in'];

      const response = NextResponse.json({
        authenticated: true,
        message: 'Access token refreshed',
      });

      // Set new access token as a cookie in the response
      response.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expiresIn,
        path: '/',
      });

      return response;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      return NextResponse.json(
        { authenticated: false, message: 'Failed to refresh access token' },
        { status: 500 }
      );
    }
  }

  // If neither token is available, request the user to log in
  return NextResponse.json(
    { authenticated: false, message: 'No tokens, please log in' },
    { status: 401 }
  );
}

// login the user
export async function POST(req: NextRequest) {
  const body = await req.json();
  const code = body.code;

  if (code === '') {
    console.error('Authorization code is missing from request');
    return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 });
  }

  console.log('Received authorization code.');

  try {
    const data = await spotifyAPI.authorizationCodeGrant(code);
    const accessToken = data.body['access_token'];
    const refreshToken = data.body['refresh_token'];
    const expiresIn = data.body['expires_in'];
    console.log('Received access token, refresh token, expires in.');

    spotifyAPI.setAccessToken(accessToken);
    spotifyAPI.setRefreshToken(refreshToken);

    // Prepare response with cookies for access_token and refresh_token
    const response = NextResponse.json({ message: 'Tokens set successfully' });

    // Set cookies for access and refresh tokens
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiresIn,
      path: '/',
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiresIn * 480,
      path: '/',
    });

    return response;
  } catch (err) {
    console.log('Redirect URI:', process.env.NEXT_PUBLIC_REDIRECT_URL);
    console.error('Error during authorization code grant', err);
    return NextResponse.json({ error: 'Failed to retrieve tokens' }, { status: 400 });
  }
}

// logout the user
export async function DELETE() {}
