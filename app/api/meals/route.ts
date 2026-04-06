import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { createMealSchema, dateSchema } from "@/lib/validation/schemas";
import { GAMIFICATION } from "@/config/constants";
import { MESSAGES } from "@/config/messages";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 });
  }

  const date = request.nextUrl.searchParams.get("date");
  const parsed = dateSchema.safeParse(date);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const meals = await prisma.mealLog.findMany({
    where: { userId: session.user.id, date: parsed.data },
    include: { foods: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ data: meals });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createMealSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((e) => e.message).join(", ") },
      { status: 400 },
    );
  }

  const { date, mealType, foods } = parsed.data;

  const totalCalories = foods.reduce((s, f) => s + Math.round(f.calories * f.quantity), 0);
  const totalProtein = foods.reduce((s, f) => s + Math.round(f.protein * f.quantity), 0);
  const totalCarbs = foods.reduce((s, f) => s + Math.round(f.carbs * f.quantity), 0);
  const totalFat = foods.reduce((s, f) => s + Math.round(f.fat * f.quantity), 0);

  const mealLog = await prisma.mealLog.create({
    data: {
      userId: session.user.id,
      date,
      mealType,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      foods: {
        create: foods.map((f) => ({
          foodId: f.foodId,
          name: f.name,
          quantity: f.quantity,
          calories: Math.round(f.calories * f.quantity),
          protein: Math.round(f.protein * f.quantity),
          carbs: Math.round(f.carbs * f.quantity),
          fat: Math.round(f.fat * f.quantity),
        })),
      },
    },
    include: { foods: true },
  });

  const today = new Date().toISOString().split("T")[0];
  if (date === today) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (profile) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const isStreakContinued = profile.lastLogDate === yesterday || profile.lastLogDate === today;
      const isNewDay = profile.lastLogDate !== today;

      const newStreak = isNewDay ? (isStreakContinued ? profile.streak + 1 : 1) : profile.streak;

      await prisma.userProfile.update({
        where: { userId: session.user.id },
        data: {
          xp: { increment: GAMIFICATION.XP_PER_MEAL_LOG },
          lastLogDate: today,
          streak: newStreak,
          longestStreak: Math.max(newStreak, profile.longestStreak),
        },
      });
    }
  }

  return NextResponse.json({ data: mealLog }, { status: 201 });
}
