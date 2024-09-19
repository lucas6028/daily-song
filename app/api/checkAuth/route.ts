import { NextRequest, NextResponse } from "next/server";
import spotifyAPI from "config/spotifyConfig";

// Define the GET method
export async function GET(req: NextRequest) {
  const cookieStore = req.cookies; // In Next.js, 'NextRequest' doesn't use 'cookies()'
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (accessToken) {
    // Access token exists, assume it's valid
    return NextResponse.json({
      authenticated: true,
      message: "Access token is present",
    });
  }

  if (refreshToken) {
    // No access token, but refresh token exists, so refresh the access token
    try {
      spotifyAPI.setRefreshToken(refreshToken);
      const data = await spotifyAPI.refreshAccessToken();
      const newAccessToken = data.body["access_token"];
      const expiresIn = data.body["expires_in"];

      const response = NextResponse.json({
        authenticated: true,
        message: "Access token refreshed",
      });

      // Set new access token as a cookie in the response
      response.cookies.set("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NEXT_PUBLIC_NODE_ENV === "production",
        sameSite: "strict",
        maxAge: expiresIn * 1000,
        path: "/",
      });

      return response;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return NextResponse.json(
        { authenticated: false, message: "Failed to refresh access token" },
        { status: 500 }
      );
    }
  }

  // If neither token is available, request the user to log in
  return NextResponse.json(
    { authenticated: false, message: "No tokens, please log in" },
    { status: 401 }
  );
}
