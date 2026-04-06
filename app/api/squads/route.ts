import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { MESSAGES } from "@/config/messages";
import { z } from "zod";
import crypto from "crypto";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = crypto.randomBytes(7);
  for (let i = 0; i < 7; i++) code += chars[bytes[i] % chars.length];
  return code;
}

const createSchema = z.object({
  name: z.string().min(2).max(30),
  description: z.string().max(120).optional(),
});

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 });

  const memberships = await prisma.squadMember.findMany({
    where: { userId: session.user.id },
    include: {
      squad: {
        include: { _count: { select: { members: true } } },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const squads = memberships.map((m) => ({
    id: m.squad.id,
    name: m.squad.name,
    code: m.squad.code,
    description: m.squad.description,
    createdBy: m.squad.createdBy,
    maxMembers: m.squad.maxMembers,
    createdAt: m.squad.createdAt.toISOString(),
    memberCount: m.squad._count.members,
    role: m.role,
  }));

  return NextResponse.json({ data: squads });
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 });

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const existing = await prisma.squadMember.count({
    where: { userId: session.user.id },
  });
  if (existing >= 5) {
    return NextResponse.json({ error: "You can be in at most 5 squads" }, { status: 400 });
  }

  let code = generateCode();
  while (await prisma.squad.findUnique({ where: { code } })) {
    code = generateCode();
  }

  const squad = await prisma.squad.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      code,
      createdBy: session.user.id,
      members: {
        create: { userId: session.user.id, role: "owner" },
      },
    },
  });

  return NextResponse.json({ data: { code: squad.code } }, { status: 201 });
}
