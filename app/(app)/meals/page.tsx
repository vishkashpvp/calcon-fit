import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getRequiredSession } from "@/lib/session";
import { MealsClient } from "./meals-client";

export const metadata = { title: "Meals" };

export default async function MealsPage() {
  const session = await getRequiredSession();

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile?.isProfileComplete) redirect("/profile/setup");

  const today = new Date().toISOString().split("T")[0];

  const todayMeals = await prisma.mealLog.findMany({
    where: { userId: session.user.id, date: today },
    include: { foods: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <MealsClient
      dailyCalGoal={profile.dailyCalGoal}
      meals={JSON.parse(JSON.stringify(todayMeals))}
      date={today}
    />
  );
}
