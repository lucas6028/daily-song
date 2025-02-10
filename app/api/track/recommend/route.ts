import getAccessToken from 'lib/getAccessToken'; // Helper function to get access token
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 1. Get KKBOX Access Token
    const accessToken = await getAccessToken(); // Implement this function based on your KKBOX API setup.  See example below.

    if (!accessToken) {
      return NextResponse.json({
        message: 'Failed to retrieve access token',
        status: 500,
      });
    }

    // 2. Fetch Recommended Seed Tracks based on user's play history
    const searchParams = request.nextUrl.searchParams;

    const territory = searchParams.get('territory') || 'TW'; // Hardcoded for simplicity, but you can get this from the user's location
    const trackId = searchParams.get('track_id') || 'Paz8PyxaWKr82o2PlV'; // Hardcoded for simplicity, but you can get this from the user's play history
    const limit = parseInt(searchParams.get('limit') || '10', 10); // Number of recommended tracks to return
    const offset = parseInt(searchParams.get('offset') || '10', 10); // Offset for pagination (if needed)
    const url = `https://api.kkbox.com/v1.1/tracks/${trackId}/recommended-tracks?territory=${territory}&offset=${offset}&limit=${limit}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json', // Important for receiving JSON response
      },
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json(); // Get error details from KKBOX
      console.error('KKBOX API Error:', errorData); // Log the error for debugging
      return NextResponse.json({
        message: 'Failed to fetch recommended tracks',
        status: response.status,
      });
    }

    const recommendedTracks = await response.json();

    // 3. Return the recommended tracks
    return NextResponse.json({ tracks: recommendedTracks.tracks.data, status: 200 });
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({
      message: 'Server error',
      status: 500,
    });
  }
}
