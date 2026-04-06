import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import { calculateDailyCalGoal } from "@/lib/gamification";

const weightSchema = z.object({
  weight: z.number().min(20).max(500),
  note: z.string().max(200).optional(),
});

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = weightSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(", ") },
      { status: 400 },
    );
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
    select: { height: true, age: true, gender: true, activityLevel: true, targetWeight: true },
  });

  const log = await prisma.weightLog.create({
    data: {
      userId: session.user.id,
      weight: parsed.data.weight,
      note: parsed.data.note ?? null,
      loggedAt: new Date(),
    },
  });

  let newCalGoal: number | undefined;
  if (profile?.height && profile?.age && profile?.gender && profile?.activityLevel) {
    newCalGoal = calculateDailyCalGoal({
      weight: parsed.data.weight,
      height: profile.height,
      age: profile.age,
      gender: profile.gender as "male" | "female" | "other",
      activityLevel: profile.activityLevel,
      targetWeight: profile.targetWeight ?? undefined,
    });
  }

  await prisma.userProfile.update({
    where: { userId: session.user.id },
    data: {
      currentWeight: parsed.data.weight,
      ...(newCalGoal !== undefined && { dailyCalGoal: newCalGoal }),
    },
  });

  return NextResponse.json({ data: log });
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "30"), 100);

  const logs = await prisma.weightLog.findMany({
    where: { userId: session.user.id },
    orderBy: { loggedAt: "desc" },
    take: limit,
  });

  return NextResponse.json({ data: logs });
}
