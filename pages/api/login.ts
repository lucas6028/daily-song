"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import spotifyAPI from "../../config/spotifyConfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { code = "" } = req.query as { code?: string };
    const cookieStore = cookies();

    if (!code) {
      console.error("Authorization code is missing from request");
      return res.status(400).json({ error: "Authorization code is required" });
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

      cookieStore.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: expiresIn * 1000,
        path: "/",
      });
      cookieStore.set("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: expiresIn * 1000 * 30,
        path: "/",
      });
      res.send("Cookie set: access_token, refresh_token");
    } catch (err) {
      console.log("redirect uri:" + process.env.API_REDIRECT_URI);
      console.error("Error during authorization code grant", err);
      res.status(400).json({ error: "Failed to retrieve tokens" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// router.get("/token", (req, res) => {
//   const access_token = req.cookies["access_token"];
//   if (!access_token) {
//     return res.status(401).json({ error: "Access token is missing" });
//   }

//   if (access_token) {
//     res.send(access_token);
//   } else {
//     res.status(401).json({ error: "Token not available" });
//   }
// });
