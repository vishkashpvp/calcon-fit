import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const joinSchema = z.object({
  code: z.string().length(7),
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = joinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 400 });
  }

  const squad = await prisma.squad.findUnique({
    where: { code: parsed.data.code.toUpperCase() },
    include: { _count: { select: { members: true } } },
  });

  if (!squad) {
    return NextResponse.json({ error: "Squad not found" }, { status: 404 });
  }

  const alreadyMember = await prisma.squadMember.findUnique({
    where: { squadId_userId: { squadId: squad.id, userId: session.user.id } },
  });
  if (alreadyMember) {
    return NextResponse.json(
      { error: "Already a member", alreadyMember: true, code: squad.code },
      { status: 409 },
    );
  }

  if (squad._count.members >= squad.maxMembers) {
    return NextResponse.json({ error: "Squad is full" }, { status: 400 });
  }

  const userSquadCount = await prisma.squadMember.count({
    where: { userId: session.user.id },
  });
  if (userSquadCount >= 5) {
    return NextResponse.json({ error: "You can be in at most 5 squads" }, { status: 400 });
  }

  await prisma.squadMember.create({
    data: { squadId: squad.id, userId: session.user.id },
  });

  return NextResponse.json({ code: squad.code }, { status: 200 });
}
