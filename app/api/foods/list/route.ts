import { NextRequest, NextResponse } from "next/server";

import { MESSAGES } from "@/config/messages";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("search")?.trim() ?? "";
  if (search.length < 2) {
    return NextResponse.json({ data: [] });
  }

  const foods = await prisma.foodItem.findMany({
    where: { name: { contains: search, mode: "insensitive" } },
    take: 20,
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: foods });
}
