"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Crown,
  Flame,
  Zap,
  Trophy,
  LogOut,
  Loader2,
  ArrowLeft,
  Trash2,
  Share2,
  UserMinus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLevelInfo } from "@/lib/gamification";
import { getInitials } from "@/lib/utils";
import { env } from "@/env";
import type { Squad, SquadMember } from "@/types";

type LeaderboardTab = "calories" | "protein" | "streak";

interface SquadDetailClientProps {
  squad: Squad;
  members: SquadMember[];
  currentUserId: string;
}

function CopyInviteLink({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const link = `${env.NEXT_PUBLIC_APP_URL}/invite/${code}`;
  const copy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="outline" size="sm" onClick={copy} className="gap-1.5">
      <Share2 className="h-3.5 w-3.5" />
      {copied ? "Copied!" : "Invite Link"}
    </Button>
  );
}

export function SquadDetailClient({ squad, members, currentUserId }: SquadDetailClientProps) {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [kickingId, setKickingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("calories");

  const isOwner = squad.createdBy === currentUserId;

  const sorted = [...members].sort((a, b) => {
    if (activeTab === "calories") return b.todayCalories - a.todayCalories;
    if (activeTab === "protein") return b.todayProtein - a.todayProtein;
    return (b.profile?.streak ?? 0) - (a.profile?.streak ?? 0);
  });

  const handleLeave = async () => {
    if (isOwner) {
      if (members.length > 1) {
        alert("Remove all members before deleting your squad.");
        return;
      }
      if (!confirm("You're the only member. This will delete the squad. Continue?")) return;
    } else {
      if (!confirm("Leave this squad?")) return;
    }

    setLeaving(true);
    try {
      const res = await fetch(`/api/squads/${squad.code}/leave`, { method: "POST" });
      if (!res.ok) {
        const json = await res.json();
        alert(json.error ?? "Failed to leave squad");
        return;
      }
      router.push("/squads");
      router.refresh();
    } finally {
      setLeaving(false);
    }
  };

  const handleKick = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from the squad?`)) return;
    setKickingId(userId);
    try {
      const res = await fetch(`/api/squads/${squad.code}/kick`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) {
        const json = await res.json();
        alert(json.error ?? "Failed to remove member");
        return;
      }
      router.refresh();
    } finally {
      setKickingId(null);
    }
  };

  const anim = (delay: number) => ({
    initial: { opacity: 0 } as const,
    animate: { opacity: 1 } as const,
    transition: { delay, duration: 0.3 },
  });

  const tabs: { key: LeaderboardTab; label: string; emoji: string }[] = [
    { key: "calories", label: "Calories", emoji: "🏆" },
    { key: "protein", label: "Protein", emoji: "🍗" },
    { key: "streak", label: "Streak", emoji: "🔥" },
  ];

  function getStatValue(member: SquadMember) {
    if (activeTab === "calories") return `${member.todayCalories} cal`;
    if (activeTab === "protein") return `${member.todayProtein}g`;
    return `${member.profile?.streak ?? 0}d`;
  }

  function getBarPct(member: SquadMember) {
    if (activeTab === "streak") {
      const maxStreak = Math.max(...members.map((m) => m.profile?.streak ?? 0), 1);
      return Math.round(((member.profile?.streak ?? 0) / maxStreak) * 100);
    }
    const goal = member.profile?.dailyCalGoal ?? 0;
    if (activeTab === "calories") {
      return goal > 0 ? Math.min(100, Math.round((member.todayCalories / goal) * 100)) : 0;
    }
    const proteinGoal = goal > 0 ? Math.round((goal * 0.3) / 4) : 0;
    return proteinGoal > 0
      ? Math.min(100, Math.round((member.todayProtein / proteinGoal) * 100))
      : 0;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...anim(0)}>
        <Link
          href="/squads"
          className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All Squads
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{squad.name}</h1>
            {squad.description && (
              <p className="text-muted-foreground mt-0.5 text-sm">{squad.description}</p>
            )}
          </div>
          <CopyInviteLink code={squad.code} />
        </div>
        <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {members.length}/{squad.maxMembers} members
          </span>
          <span
            className={`px-2 py-0.5 text-xs leading-none font-semibold ${
              isOwner ? "bg-accent-violet/15 text-accent-violet" : "bg-muted text-muted-foreground"
            }`}
          >
            {isOwner ? "Owner" : "Member"}
          </span>
        </div>
      </motion.div>

      {/* Leaderboard + Members */}
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr] lg:items-start">
        {/* Leaderboard */}
        <motion.div {...anim(0.05)}>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="text-accent-violet h-4 w-4" />
                  <CardTitle className="text-base">Leaderboard</CardTitle>
                </div>
                <div className="border-border/50 relative flex gap-1 border p-1">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`relative z-10 flex items-center gap-1.5 px-3 py-1 text-xs font-medium transition-colors ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="lb-tab"
                            className="bg-accent-violet absolute inset-0"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative text-sm leading-none">{tab.emoji}</span>
                        <span className={`relative ${!isActive ? "max-sm:hidden" : ""}`}>
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {sorted.map((member, rank) => {
                const pct = getBarPct(member);
                const isMe = member.userId === currentUserId;

                return (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                      isMe ? "bg-primary/5 ring-primary/15 ring-1" : "hover:bg-muted/30"
                    }`}
                  >
                    <span
                      className={`w-5 text-center text-sm font-bold tabular-nums ${
                        rank === 0 ? "text-accent-violet" : "text-muted-foreground"
                      }`}
                    >
                      {rank + 1}
                    </span>

                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user.image ?? ""} />
                      <AvatarFallback className="text-xs">
                        {getInitials(member.user.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium">
                          {member.user.name}
                          {isMe && <span className="text-muted-foreground ml-1">(you)</span>}
                        </p>
                        {member.role === "owner" && (
                          <Crown className="text-accent-violet h-3 w-3 shrink-0" />
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="bg-bar-fill/8 h-1.5 flex-1 overflow-hidden">
                          <div
                            className="bg-bar-fill/50 h-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                          {pct}%
                        </span>
                      </div>
                    </div>

                    <p className="shrink-0 text-sm font-bold tabular-nums">
                      {getStatValue(member)}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Members */}
        <motion.div {...anim(0.1)}>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {members.map((member) => {
                  const level = getLevelInfo(member.profile?.xp ?? 0);
                  const isMe = member.userId === currentUserId;
                  return (
                    <div
                      key={member.id}
                      className="border-border/40 flex items-center gap-3 border p-3"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={member.user.image ?? ""} />
                        <AvatarFallback className="text-xs">
                          {getInitials(member.user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-medium">{member.user.name}</p>
                          {member.role === "owner" && (
                            <Badge variant="secondary" className="text-[10px] leading-none">
                              Owner
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground mt-0.5 flex items-center gap-2 text-xs">
                          <span className="flex items-center gap-0.5">
                            <Zap className="h-3 w-3" /> Lv {level.level}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Flame className="h-3 w-3" /> {member.profile?.streak ?? 0}d
                          </span>
                        </div>
                      </div>
                      {isOwner && !isMe && (
                        <button
                          onClick={() => handleKick(member.userId, member.user.name)}
                          disabled={kickingId === member.userId}
                          className="text-muted-foreground hover:text-destructive shrink-0 p-1 transition-colors"
                          title="Remove member"
                        >
                          {kickingId === member.userId ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <UserMinus className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div {...anim(0.15)}>
        {isOwner ? (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleLeave}
            disabled={leaving}
          >
            {leaving ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-3.5 w-3.5" />
            )}
            {members.length === 1 ? "Delete Squad" : "Delete Squad"}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={handleLeave}
            disabled={leaving}
          >
            {leaving ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="mr-2 h-3.5 w-3.5" />
            )}
            Leave Squad
          </Button>
        )}
      </motion.div>
    </div>
  );
}
