import { NextResponse } from "next/server";

export async function GET() {
  const body = { message: "Welcome to CalConFit Api" };
  return NextResponse.json(body, { status: 200 });
}
