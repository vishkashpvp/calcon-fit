import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";

export async function POST(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code } = await params;
  const squad = await prisma.squad.findUnique({ where: { code: code.toUpperCase() } });
  if (!squad) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const membership = await prisma.squadMember.findUnique({
    where: { squadId_userId: { squadId: squad.id, userId: session.user.id } },
  });
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 400 });
  }

  if (membership.role === "owner") {
    const memberCount = await prisma.squadMember.count({ where: { squadId: squad.id } });

    if (memberCount === 1) {
      await prisma.squad.delete({ where: { id: squad.id } });
      return NextResponse.json({ deleted: true });
    }

    return NextResponse.json(
      { error: "Remove all members before deleting your squad" },
      { status: 400 },
    );
  }

  await prisma.squadMember.delete({
    where: { squadId_userId: { squadId: squad.id, userId: session.user.id } },
  });

  return NextResponse.json({ left: true });
}
