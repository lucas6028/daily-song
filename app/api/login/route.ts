import { NextRequest, NextResponse } from "next/server";
import spotifyAPI from "../../../config/spotifyConfig";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code") || "";
  const cookieStore = req.cookies;

  if (!code) {
    console.error("Authorization code is missing from request");
    return NextResponse.json(
      { error: "Authorization code is required" },
      { status: 400 }
    );
  }

  console.log("Received authorization code.");

  try {
    const data = await spotifyAPI.authorizationCodeGrant(code);
    const accessToken = data.body["access_token"];
    const refreshToken = data.body["refresh_token"];
    const expiresIn = data.body["expires_in"];
    console.log("Received access token, refresh token, expires in.");

    spotifyAPI.setAccessToken(accessToken);
    spotifyAPI.setRefreshToken(refreshToken);

    // Prepare response with cookies for access_token and refresh_token
    const response = NextResponse.json({ message: "Tokens set successfully" });

    // Set cookies for access and refresh tokens
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn * 1000,
      path: "/",
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
      sameSite: "strict",
      maxAge: expiresIn * 1000 * 30, // 30 times expiration for refresh token
      path: "/",
    });

    return response;
  } catch (err) {
    console.log("Redirect URI:", process.env.API_REDIRECT_URI);
    console.error("Error during authorization code grant", err);
    return NextResponse.json(
      { error: "Failed to retrieve tokens" },
      { status: 400 }
    );
  }
}
