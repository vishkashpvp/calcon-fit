import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getRequiredSession } from "@/lib/session";
import { TrendsClient } from "./trends-client";

export const metadata = { title: "Trends" };

export default async function TrendsPage() {
  const session = await getRequiredSession();

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile?.isProfileComplete) redirect("/profile/setup");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thirtyDaysStr = thirtyDaysAgo.toISOString().split("T")[0];

  const [weightLogs, mealLogs] = await Promise.all([
    prisma.weightLog.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: 100,
    }),
    prisma.mealLog.findMany({
      where: { userId: session.user.id, date: { gte: thirtyDaysStr } },
      orderBy: { date: "asc" },
      select: {
        date: true,
        totalCalories: true,
        totalProtein: true,
        totalCarbs: true,
        totalFat: true,
      },
    }),
  ]);

  const dailyNutrition: Record<
    string,
    { calories: number; protein: number; carbs: number; fat: number }
  > = {};
  for (const meal of mealLogs) {
    if (!dailyNutrition[meal.date]) {
      dailyNutrition[meal.date] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    dailyNutrition[meal.date].calories += meal.totalCalories;
    dailyNutrition[meal.date].protein += meal.totalProtein;
    dailyNutrition[meal.date].carbs += meal.totalCarbs;
    dailyNutrition[meal.date].fat += meal.totalFat;
  }

  const last30Days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last30Days.push(d.toISOString().split("T")[0]);
  }

  const nutritionTrend = last30Days.map((date) => ({
    date,
    label: new Date(date + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    ...(dailyNutrition[date] ?? { calories: 0, protein: 0, carbs: 0, fat: 0 }),
  }));

  return (
    <TrendsClient
      weightLogs={JSON.parse(JSON.stringify(weightLogs))}
      nutritionTrend={nutritionTrend}
      dailyCalGoal={profile.dailyCalGoal}
      targetWeight={profile.targetWeight}
      currentWeight={profile.currentWeight}
    />
  );
}
