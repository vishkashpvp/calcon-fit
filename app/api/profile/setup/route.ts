import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { profileSetupSchema } from "@/lib/validation/schemas";
import { calculateDailyCalGoal } from "@/lib/gamification";
import { MESSAGES } from "@/config/messages";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 });
  }

  const body = await request.json();
  const parsed = profileSetupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(", ") },
      { status: 400 },
    );
  }

  const { currentWeight, targetWeight, height, age, gender, activityLevel } = parsed.data;

  const dailyCalGoal = calculateDailyCalGoal({
    weight: currentWeight,
    height,
    age,
    gender,
    activityLevel,
    targetWeight,
  });

  const existing = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
    select: { startWeight: true },
  });

  await prisma.userProfile.upsert({
    where: { userId: session.user.id },
    update: {
      currentWeight,
      targetWeight,
      height,
      age,
      gender,
      activityLevel,
      dailyCalGoal,
      isProfileComplete: true,
    },
    create: {
      userId: session.user.id,
      currentWeight,
      targetWeight,
      startWeight: currentWeight,
      height,
      age,
      gender,
      activityLevel,
      dailyCalGoal,
      isProfileComplete: true,
    },
  });

  if (existing && existing.startWeight === 0) {
    await prisma.userProfile.update({
      where: { userId: session.user.id },
      data: { startWeight: currentWeight },
    });
  }

  return NextResponse.json({
    message: MESSAGES.PROFILE.SETUP_SUCCESS,
    data: { dailyCalGoal },
  });
}
