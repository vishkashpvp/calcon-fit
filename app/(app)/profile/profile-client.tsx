"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Scale,
  Ruler,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Flame,
  Zap,
  Star,
  Trophy,
  Medal,
  Crown,
  Utensils,
  ChevronRight,
  Info,
  Clock,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/auth-client";
import { PageModuleHeader } from "@/components/layout/page-module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WeightEntry } from "@/components/weight-entry";
import { XpBar } from "@/components/dashboard/xp-bar";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { getLevelInfo } from "@/lib/gamification";
import { cn, getInitials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ACTIVITY_LEVELS, GAMIFICATION } from "@/config/constants";
import type { UserProfile, WeightLog } from "@/types";

interface ProfileClientProps {
  user: { name: string; email: string; image: string | null };
  profile: UserProfile;
  totalMealsLogged: number;
  memberSinceDays: number;
  recentWeightLogs: WeightLog[];
}

interface Achievement {
  id: string;
  icon: typeof Star;
  title: string;
  earned: boolean;
  color: string;
}

function getAchievements(profile: UserProfile, totalMeals: number): Achievement[] {
  return [
    {
      id: "first-meal",
      icon: Utensils,
      title: "First Bite",
      earned: totalMeals >= 1,
      color: "text-accent-violet",
    },
    {
      id: "10-meals",
      icon: Medal,
      title: "Logger",
      earned: totalMeals >= 10,
      color: "text-accent-violet",
    },
    {
      id: "50-meals",
      icon: Trophy,
      title: "Meal Master",
      earned: totalMeals >= 50,
      color: "text-accent-violet",
    },
    {
      id: "streak-3",
      icon: Flame,
      title: "On Fire",
      earned: profile.longestStreak >= 3,
      color: "text-accent-violet",
    },
    {
      id: "streak-7",
      icon: Flame,
      title: "Week Warrior",
      earned: profile.longestStreak >= 7,
      color: "text-accent-violet",
    },
    {
      id: "streak-30",
      icon: Crown,
      title: "Monthly Legend",
      earned: profile.longestStreak >= 30,
      color: "text-accent-violet",
    },
    {
      id: "level-2",
      icon: Star,
      title: "Explorer",
      earned: profile.xp >= 100,
      color: "text-accent-violet",
    },
    {
      id: "level-3",
      icon: Zap,
      title: "Warrior",
      earned: profile.xp >= 300,
      color: "text-accent-violet",
    },
    {
      id: "level-5",
      icon: Crown,
      title: "Legendary",
      earned: profile.xp >= 1000,
      color: "text-accent-violet",
    },
  ];
}

function formatLogTime(isoString: string) {
  const d = new Date(isoString);
  return (
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  );
}

export function ProfileClient({
  user,
  profile,
  totalMealsLogged,
  memberSinceDays,
  recentWeightLogs,
}: ProfileClientProps) {
  const router = useRouter();
  const levelInfo = getLevelInfo(profile.xp);
  const activityLabel =
    ACTIVITY_LEVELS.find((a) => a.value === profile.activityLevel)?.label ?? "Unknown";

  const startW = profile.startWeight > 0 ? profile.startWeight : profile.currentWeight;
  const totalToChange = Math.abs(startW - profile.targetWeight);
  const changedSoFar = Math.abs(startW - profile.currentWeight);
  const weightProgressPct =
    totalToChange > 0 ? Math.min(100, Math.round((changedSoFar / totalToChange) * 100)) : 0;
  const isGaining = profile.targetWeight > startW;
  const kgRemaining = Math.abs(profile.currentWeight - profile.targetWeight);

  const achievements = getAchievements(profile, totalMealsLogged);
  const earnedCount = achievements.filter((a) => a.earned).length;

  const anim = (delay: number) => ({
    initial: { opacity: 0 } as const,
    animate: { opacity: 1 } as const,
    transition: { delay, duration: 0.35 },
  });

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div {...anim(0)}>
        <PageModuleHeader
          category="Profile"
          title={user.name}
          description="Your progress, stats, and achievements"
          actions={
            <Avatar className="h-16 w-16 shrink-0 sm:h-20 sm:w-20">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback className="text-lg sm:text-xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          }
        />
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="neon" className="px-3 py-1">
            {levelInfo.name}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1 capitalize">
            {profile.gender}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            {memberSinceDays} day{memberSinceDays !== 1 ? "s" : ""} member
          </Badge>
          <Link href="/settings" className="ml-auto shrink-0">
            <Button variant="outline" size="sm" className="gap-1.5 text-sm">
              Edit <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Stat Strip */}
      <motion.div {...anim(0.05)}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Meals Logged", value: totalMealsLogged.toString(), icon: Utensils },
            { label: "Total XP", value: profile.xp.toString(), icon: Zap },
            { label: "Current Streak", value: `${profile.streak}d`, icon: Flame },
            { label: "Achievements", value: `${earnedCount}/${achievements.length}`, icon: Trophy },
          ].map((item, i) => (
            <Card key={item.label}>
              <CardContent className="flex items-center gap-2 p-3 sm:gap-3 sm:p-5">
                <div className="bg-accent-violet/10 flex h-8 w-8 shrink-0 items-center justify-center sm:h-10 sm:w-10">
                  <item.icon className="text-accent-violet h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-base leading-tight font-bold tabular-nums sm:text-lg">
                    {item.value}
                  </p>
                  <p className="text-muted-foreground text-[11px] sm:text-xs">{item.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="border-accent-violet/40 bg-accent-violet/10 mt-3 border-l-2 px-3 py-2">
          <p className="text-muted-foreground text-[11px]">
            <span className="text-accent-violet font-semibold">XP</span> (Experience Points) — earn
            by logging meals (+10), hitting daily goals (+25), maintaining streaks (+5/day), and
            completing quests (+50)
          </p>
        </div>
      </motion.div>

      {/* Gamification + Body Stats */}
      <div className="grid gap-4 sm:grid-cols-2">
        <motion.div {...anim(0.1)}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base tracking-wide">Progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <XpBar xp={profile.xp} showHint />
              <StreakCounter
                streak={profile.streak}
                longestStreak={profile.longestStreak}
                showHint
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div {...anim(0.15)}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-base tracking-wide">Body Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Scale, label: "Current Weight", value: `${profile.currentWeight} kg` },
                  { icon: Target, label: "Target Weight", value: `${profile.targetWeight} kg` },
                  { icon: Ruler, label: "Height", value: `${profile.height} cm` },
                  { icon: Calendar, label: "Age", value: `${profile.age} years` },
                  { icon: TrendingUp, label: "Activity", value: activityLabel },
                  { icon: Award, label: "Daily Goal", value: `${profile.dailyCalGoal} cal` },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                      <stat.icon className="h-3.5 w-3.5" />
                      {stat.label}
                    </div>
                    <p className="text-sm font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weight Progress + Entries */}
        <motion.div {...anim(0.2)}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base tracking-wide">Weight Goal</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {kgRemaining.toFixed(1)} kg {isGaining ? "to gain" : "to lose"}
                  </Badge>
                  <Link href="/trends">
                    <Button variant="ghost" size="sm" className="h-7 gap-1 px-2 text-xs">
                      Trends <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Scale className="text-muted-foreground h-4 w-4" />
                  <span className="font-medium">Log weight</span>
                </div>
                <WeightEntry
                  currentWeight={profile.currentWeight}
                  onSaved={() => router.refresh()}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold tabular-nums">{profile.currentWeight}</p>
                  <p className="text-muted-foreground text-xs">Current</p>
                </div>
                <div className="flex-1">
                  <div className="bg-bar-fill/8 relative h-2.5 overflow-hidden rounded-full">
                    <motion.div
                      className="bg-bar-fill/50 absolute inset-y-0 left-0 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${weightProgressPct}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-muted-foreground mt-1 text-center text-xs">
                    {weightProgressPct}% of goal
                    {startW !== profile.currentWeight && ` (started at ${startW} kg)`}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-success text-lg font-bold tabular-nums">
                    {profile.targetWeight}
                  </p>
                  <p className="text-muted-foreground text-xs">Target</p>
                </div>
              </div>

              {recentWeightLogs.length > 0 && (
                <div className="bg-muted/20 flex items-center justify-between gap-3 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <Scale className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                    <span className="text-sm font-semibold tabular-nums">
                      {recentWeightLogs[0].weight} kg
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {formatLogTime(recentWeightLogs[0].loggedAt)}
                    </span>
                  </div>
                  <Link href="/trends">
                    <Button variant="ghost" size="sm" className="h-6 gap-0.5 px-1.5 text-[10px]">
                      All <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievements */}
        <motion.div {...anim(0.25)}>
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base tracking-wide">Achievements</CardTitle>
                <span className="text-muted-foreground text-sm">
                  {earnedCount}/{achievements.length} unlocked
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all",
                      ach.earned
                        ? "border-foreground/15 bg-foreground/5"
                        : "border-border/50 grayscale",
                    )}
                  >
                    <ach.icon
                      className={cn("h-4 w-4", ach.earned ? ach.color : "text-muted-foreground")}
                    />
                    <span className={ach.earned ? "font-medium" : "text-muted-foreground"}>
                      {ach.title}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Level Roadmap */}
      <motion.div {...anim(0.3)}>
        <Card>
          <CardHeader className="pb-3">
            <div>
              <CardTitle className="text-base tracking-wide">Level Roadmap</CardTitle>
              <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                <Info className="h-3 w-3" />
                Earn XP (Experience Points) through meals, streaks, and challenges to level up
              </p>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:px-6 sm:pb-6 [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-max items-start">
              {GAMIFICATION.LEVELS.map((lvl, i) => {
                const isCurrentLevel = levelInfo.level === lvl.level;
                const isUnlocked = profile.xp >= lvl.minXp;
                const isLast = i === GAMIFICATION.LEVELS.length - 1;

                return (
                  <div key={lvl.level} className={cn("flex items-start", !isLast && "flex-1")}>
                    {/* Node */}
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center border-2 text-xs font-bold",
                          isCurrentLevel
                            ? "border-foreground bg-foreground text-background"
                            : isUnlocked
                              ? "border-foreground/40 bg-foreground/10 text-foreground"
                              : "border-border bg-muted text-muted-foreground",
                        )}
                      >
                        {lvl.level}
                      </div>
                      <p
                        className={cn(
                          "mt-1.5 text-center text-[10px] leading-tight font-semibold",
                          isCurrentLevel
                            ? "text-foreground"
                            : isUnlocked
                              ? "text-foreground"
                              : "text-muted-foreground",
                        )}
                      >
                        {lvl.name}
                      </p>
                      <p className="text-muted-foreground mt-0.5 text-center text-[9px] tabular-nums">
                        {isCurrentLevel ? `${profile.xp} XP` : isUnlocked ? "✓" : `${lvl.minXp} XP`}
                      </p>
                    </div>
                    {/* Connector line */}
                    {!isLast && (
                      <div className="mt-4 flex flex-1 items-center px-1">
                        <div className="bg-border relative h-0.5 w-full overflow-hidden">
                          {isUnlocked && (
                            <motion.div
                              className="bg-foreground/30 absolute inset-y-0 left-0"
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.6, delay: 0.1 + i * 0.08 }}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sign out */}
      <motion.div {...anim(0.35)}>
        <div className="border-border/40 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
          <p className="text-muted-foreground text-sm">
            Signed in as <span className="text-foreground font-medium">{user.email}</span>
          </p>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground gap-2 transition-colors"
            onClick={async () => {
              await signOut({ fetchOptions: { onSuccess: () => router.push("/") } });
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
