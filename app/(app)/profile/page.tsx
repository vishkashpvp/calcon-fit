import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getRequiredSession } from "@/lib/session";
import { ProfileClient } from "./profile-client";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getRequiredSession();

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile?.isProfileComplete) redirect("/profile/setup");

  const [totalMealsLogged, recentWeightLogs] = await Promise.all([
    prisma.mealLog.count({ where: { userId: session.user.id } }),
    prisma.weightLog.findMany({
      where: { userId: session.user.id },
      orderBy: { loggedAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <ProfileClient
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }}
      profile={JSON.parse(JSON.stringify(profile))}
      totalMealsLogged={totalMealsLogged}
      recentWeightLogs={JSON.parse(JSON.stringify(recentWeightLogs))}
    />
  );
}
