import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getRequiredSession } from "@/lib/session";
import { SquadDetailClient } from "./squad-detail-client";

export const metadata = { title: "Squad" };

export default async function SquadDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const session = await getRequiredSession();
  const { code } = await params;

  const squad = await prisma.squad.findUnique({
    where: { code: code.toUpperCase() },
    include: { members: { orderBy: { joinedAt: "asc" } } },
  });
  if (!squad) redirect("/squads");

  const membership = squad.members.find((m) => m.userId === session.user.id);
  if (!membership) redirect("/squads");

  const today = new Date().toISOString().split("T")[0];

  const memberData = await Promise.all(
    squad.members.map(async (m) => {
      const [user, profile, todayAgg] = await Promise.all([
        prisma.user.findUnique({
          where: { id: m.userId },
          select: { name: true, image: true },
        }),
        prisma.userProfile.findUnique({
          where: { userId: m.userId },
          select: { dailyCalGoal: true, streak: true, xp: true, level: true },
        }),
        prisma.mealLog.aggregate({
          where: { userId: m.userId, date: today },
          _sum: { totalCalories: true, totalProtein: true },
        }),
      ]);

      return {
        id: m.id,
        squadId: m.squadId,
        userId: m.userId,
        role: m.role,
        joinedAt: m.joinedAt.toISOString(),
        user: { name: user?.name ?? "Unknown", image: user?.image ?? null },
        profile: profile
          ? {
              dailyCalGoal: profile.dailyCalGoal,
              streak: profile.streak,
              xp: profile.xp,
              level: profile.level,
            }
          : null,
        todayCalories: todayAgg._sum.totalCalories ?? 0,
        todayProtein: todayAgg._sum.totalProtein ?? 0,
      };
    }),
  );

  return (
    <SquadDetailClient
      squad={{
        id: squad.id,
        name: squad.name,
        code: squad.code,
        description: squad.description,
        createdBy: squad.createdBy,
        maxMembers: squad.maxMembers,
        createdAt: squad.createdAt.toISOString(),
        memberCount: squad.members.length,
      }}
      members={memberData}
      currentUserId={session.user.id}
    />
  );
}
