import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const url = new URL("/sign-in", request.url);
  const response = NextResponse.redirect(url);
  response.cookies.delete("better-auth.session_token");
  return response;
}
