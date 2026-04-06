import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getRequiredSession } from "@/lib/session";
import { DashboardClient } from "./dashboard-client";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await getRequiredSession();

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile?.isProfileComplete) redirect("/profile/setup");

  const today = new Date().toISOString().split("T")[0];

  const [todayMeals, squadMemberships] = await Promise.all([
    prisma.mealLog.findMany({
      where: { userId: session.user.id, date: today },
      include: { foods: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.squadMember.findMany({
      where: { userId: session.user.id },
      include: {
        squad: {
          include: { _count: { select: { members: true } } },
        },
      },
      take: 3,
      orderBy: { joinedAt: "desc" },
    }),
  ]);

  const summary = {
    totalCalories: todayMeals.reduce((s, m) => s + m.totalCalories, 0),
    totalProtein: todayMeals.reduce((s, m) => s + m.totalProtein, 0),
    totalCarbs: todayMeals.reduce((s, m) => s + m.totalCarbs, 0),
    totalFat: todayMeals.reduce((s, m) => s + m.totalFat, 0),
    mealsLogged: todayMeals.length,
  };

  const recentMeals = todayMeals.slice(0, 5).map((m) => ({
    id: m.id,
    mealType: m.mealType,
    totalCalories: m.totalCalories,
    totalProtein: m.totalProtein,
    totalCarbs: m.totalCarbs,
    totalFat: m.totalFat,
    foodCount: m.foods.length,
    firstFoodName: m.foods[0]?.name ?? "Meal",
    createdAt: m.createdAt.toISOString(),
  }));

  const squads = squadMemberships.map((sm) => ({
    code: sm.squad.code,
    name: sm.squad.name,
    role: sm.role,
    memberCount: sm.squad._count.members,
  }));

  return (
    <DashboardClient
      userName={session.user.name}
      profile={JSON.parse(JSON.stringify(profile))}
      summary={summary}
      recentMeals={recentMeals}
      squads={squads}
    />
  );
}
