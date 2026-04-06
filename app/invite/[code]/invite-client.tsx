"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, LogIn, Loader2, X } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface InviteClientProps {
  squad: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    memberCount: number;
    maxMembers: number;
  };
}

export function InviteClient({ squad }: InviteClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleJoin = async () => {
    if (!session) {
      router.push(`/sign-in?callbackUrl=/invite/${squad.code}`);
      return;
    }

    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await fetch("/api/squads/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: squad.code }),
      });
      const data = await res.json();
      if (data.alreadyMember) {
        setInfo("You're already a member! Redirecting...");
        setTimeout(() => router.push(`/squads/${data.code}`), 1000);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      router.push(`/squads/${data.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  const isFull = squad.memberCount >= squad.maxMembers;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        <Card>
          <CardContent className="flex flex-col items-center gap-5 p-8 text-center">
            <div className="bg-accent-violet/10 flex h-14 w-14 items-center justify-center">
              <Users className="text-accent-violet h-7 w-7" />
            </div>

            <div>
              <p className="text-muted-foreground text-sm">You&apos;ve been invited to join</p>
              <h1 className="mt-1 text-2xl font-bold">{squad.name}</h1>
              {squad.description && (
                <p className="text-muted-foreground mt-2 text-sm">{squad.description}</p>
              )}
            </div>

            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <Users className="h-3.5 w-3.5" />
              {squad.memberCount}/{squad.maxMembers} members
            </div>

            {error && <p className="text-destructive text-sm">{error}</p>}
            {info && <p className="text-accent-violet text-sm font-medium">{info}</p>}

            <div className="flex w-full flex-col gap-2">
              <Button
                variant="glow"
                className="w-full"
                onClick={handleJoin}
                disabled={loading || isFull || !!info}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isFull ? "Squad is Full" : session ? "Join Squad" : "Sign in & Join"}
              </Button>
              <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                <X className="mr-2 h-4 w-4" />
                Ignore
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
