import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Session } from "@/lib/auth";

/**
 * Server-only helper. Returns the current session or redirects.
 * If a cookie exists but the session is invalid (e.g. DB wiped),
 * redirects to an API route that clears the stale cookie first.
 */
export async function getRequiredSession(): Promise<Session> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/api/auth/clear");
  return session;
}
