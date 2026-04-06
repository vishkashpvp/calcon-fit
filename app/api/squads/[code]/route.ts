import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { MESSAGES } from "@/config/messages";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: MESSAGES.AUTH.UNAUTHORIZED }, { status: 401 });

  const { code } = await params;

  const squad = await prisma.squad.findUnique({
    where: { code: code.toUpperCase() },
    include: { members: true },
  });
  if (!squad) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const membership = squad.members.find((m) => m.userId === session.user.id);
  if (!membership) {
    return NextResponse.json({ error: "Not a member" }, { status: 403 });
  }

  const today = new Date().toISOString().split("T")[0];

  const memberData = await Promise.all(
    squad.members.map(async (m) => {
      const [user, profile, todayMeals] = await Promise.all([
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
        todayCalories: todayMeals._sum.totalCalories ?? 0,
        todayProtein: todayMeals._sum.totalProtein ?? 0,
      };
    }),
  );

  return NextResponse.json({
    data: {
      id: squad.id,
      name: squad.name,
      code: squad.code,
      description: squad.description,
      createdBy: squad.createdBy,
      maxMembers: squad.maxMembers,
      createdAt: squad.createdAt.toISOString(),
      members: memberData,
    },
  });
}
