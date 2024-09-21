import spotifyAPI from "config/spotifyConfig";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get("access_token")?.value;
    const searchParams = request.nextUrl.searchParams;

    const id = searchParams.get("id") || "6HvZYsbFfjnjFrWF950C9d";

    if (!accessToken) {
      return NextResponse.json({
        message: "Access token is missing",
        status: 401,
      });
    }

    spotifyAPI.setAccessToken(accessToken);
    const data = await spotifyAPI.getArtistRelatedArtists(id);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error while get related artist: " + err);
    return NextResponse.json({ message: err, status: 401 });
  }
}
