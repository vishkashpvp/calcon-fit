import { prisma } from "@/lib/db/prisma";
import { getRequiredSession } from "@/lib/session";
import { SquadsClient } from "./squads-client";

export const metadata = { title: "Squads" };

export default async function SquadsPage() {
  const session = await getRequiredSession();

  const memberships = await prisma.squadMember.findMany({
    where: { userId: session.user.id },
    include: {
      squad: { include: { _count: { select: { members: true } } } },
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

  return <SquadsClient squads={squads} userId={session.user.id} />;
}
