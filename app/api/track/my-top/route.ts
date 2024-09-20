import { NextRequest, NextResponse } from "next/server";
import spotifyAPI from "config/spotifyConfig";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 10;
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Access token is missing", status: 401 });
  }

  spotifyAPI.setAccessToken(accessToken);
  spotifyAPI
    .getMyTopTracks({ limit: limit })
    .then((data) => {
      // console.log(data);
      return NextResponse.json(data);
    })
    .catch((err) => {
      console.log("Error while get my top track: ", err);
    });
}
