import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { MESSAGES } from "@/config/messages";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 });
  }

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const page = parseInt(request.nextUrl.searchParams.get("page") ?? "1");
  const limit = Math.min(parseInt(request.nextUrl.searchParams.get("limit") ?? "20"), 50);
  const skip = (page - 1) * limit;

  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : {};

  const [data, total] = await Promise.all([
    prisma.foodItem.findMany({ where, skip, take: limit, orderBy: { name: "asc" } }),
    prisma.foodItem.count({ where }),
  ]);

  return NextResponse.json({
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
