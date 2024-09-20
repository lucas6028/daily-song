import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const access_token = req.cookies.get("access_token");
  if (!access_token) {
    return NextResponse.json({ error: "Access token is missing", status: 401 });
  }

  if (access_token) {
    NextResponse.json({ access_token: access_token });
  } else {
    NextResponse.json({ error: "Token not available", status: 401 });
  }
}
