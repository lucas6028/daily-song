import { NextRequest, NextResponse } from "next/server";

export function GET(req: NextRequest) {
  const access_token = req.cookies.get("access_token");
  if (!access_token) {
    return NextResponse.json({ error: "Access token is missing", status: 401 });
  }

  if (access_token) {
    return NextResponse.json({ access_token: access_token });
  } else {
    return NextResponse.json({ error: "Token not available", status: 401 });
  }
}
