import { prisma } from "@/lib/db/prisma";
import { getRequiredSession } from "@/lib/session";
import { SettingsClient } from "./settings-client";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await getRequiredSession();

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <SettingsClient
      user={{
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? null,
      }}
      profile={profile ? JSON.parse(JSON.stringify(profile)) : null}
    />
  );
}
