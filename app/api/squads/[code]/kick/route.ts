import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const kickSchema = z.object({ userId: z.string().min(1) });

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await params;
  const squad = await prisma.squad.findUnique({ where: { code: code.toUpperCase() } });
  if (!squad) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const caller = await prisma.squadMember.findUnique({
    where: { squadId_userId: { squadId: squad.id, userId: session.user.id } },
  });
  if (!caller || caller.role !== "owner") {
    return NextResponse.json({ error: "Only the owner can remove members" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = kickSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (parsed.data.userId === session.user.id) {
    return NextResponse.json({ error: "Cannot remove yourself" }, { status: 400 });
  }

  const target = await prisma.squadMember.findUnique({
    where: { squadId_userId: { squadId: squad.id, userId: parsed.data.userId } },
  });
  if (!target) {
    return NextResponse.json({ error: "User is not a member" }, { status: 404 });
  }

  await prisma.squadMember.delete({ where: { id: target.id } });

  return NextResponse.json({ removed: true });
}
