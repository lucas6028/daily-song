import spotifyAPI from "config/spotifyConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    const searchParams = request.nextUrl.searchParams;

    const timeRange =
      (searchParams.get("time_range") as
        | "medium_term"
        | "long_term"
        | "short_term"
        | undefined) || "medium_term";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "5", 10);

    if (!accessToken) {
      return NextResponse.json({
        message: "Access token is missing",
        status: 401,
      });
    }

    spotifyAPI.setAccessToken(accessToken);
    const data = await spotifyAPI.getMyTopArtists({
      time_range: timeRange,
      limit: limit,
      offset: offset,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error while get user top artist: " + err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
