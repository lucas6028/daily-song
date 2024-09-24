import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  const access_token = req.cookies.get('access_token');
  if (!access_token) {
    return NextResponse.json({
      message: 'Access token is missing',
      status: 401,
    });
  }

  if (access_token) {
    return NextResponse.json({
      message: 'Get access token sucessfully!',
      access_token: access_token,
    });
  } else {
    return NextResponse.json({ message: 'Token not available', status: 401 });
  }
}
