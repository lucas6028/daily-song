import { NextApiRequest } from "next";
import { NextResponse } from "next/server";
import spotifyAPI from "config/spotifyConfig";

// refresh access token
export async function POST(req: NextApiRequest) {
  try {
    const refreshToken = req.cookies["refresh_token"];

    if (!refreshToken) {
      return NextResponse.json({
        error: "Refresh token is missing",
        status: 401,
      });
    }

    spotifyAPI.setRefreshToken(refreshToken);

    const data = await spotifyAPI.refreshAccessToken();
    const accessToken = data.body["access_token"];
    const expiresIn = data.body["expires_in"];

    console.log("New access token:", accessToken);

    // Set the new access token in cookies
    const res = NextResponse.json({
      message: "Token refreshed successfully!",
      status: 200,
    });
    res.cookies.set("access_token", accessToken, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: true,
    });

    return res;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    NextResponse.json({ error: "Failed to refresh access token", status: 500 });
  }
}
