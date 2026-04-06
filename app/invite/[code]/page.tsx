import { prisma } from "@/lib/db/prisma";
import { InviteClient } from "./invite-client";

export const metadata = { title: "Squad Invite" };

export default async function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const squad = await prisma.squad.findUnique({
    where: { code: code.toUpperCase() },
    include: { _count: { select: { members: true } } },
  });

  if (!squad) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid Invite</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            This invite link is invalid or the squad no longer exists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <InviteClient
      squad={{
        id: squad.id,
        name: squad.name,
        code: squad.code,
        description: squad.description,
        memberCount: squad._count.members,
        maxMembers: squad.maxMembers,
      }}
    />
  );
}
