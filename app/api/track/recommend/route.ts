import spotifyAPI from "config/spotifyConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const seed_artists = searchParams.get("seed_artists")?.split(",") || [];
    const seed_genres = searchParams.get("seed_genres")?.split(",") || [];
    const seed_tracks = searchParams.get("seed_tracks")?.split(",") || [];
    const min_popularity = parseInt(
      searchParams.get("min_popularity") || "0",
      10
    );
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const accessToken = request.cookies.get("access_token")?.value;
    if (!accessToken) {
      return NextResponse.json({
        message: "Access token is missing",
        status: 401,
      });
    }

    spotifyAPI.setAccessToken(accessToken);
    const data = await spotifyAPI.getRecommendations({
      seed_artists: seed_artists,
      seed_genres: seed_genres,
      seed_tracks: seed_tracks,
      min_popularity: min_popularity,
      limit: limit,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error while get recommend tracks: " + err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
