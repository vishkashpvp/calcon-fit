import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { MESSAGES } from "@/config/messages";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 });
  }

  const { id } = await params;

  const food = await prisma.foodItem.findUnique({ where: { id } });
  if (!food) {
    return NextResponse.json({ error: "Food not found" }, { status: 404 });
  }

  return NextResponse.json({ data: food });
}
