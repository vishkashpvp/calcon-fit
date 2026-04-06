"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  UtensilsCrossed,
  Flame,
  Zap,
  ChevronRight,
  Star,
  Check,
  Users,
  Crown,
  TrendingUp,
  Search,
  X,
  Loader2,
  Minus,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getLevelInfo } from "@/lib/gamification";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageModuleHeader } from "@/components/layout/page-module-header";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { MEAL_TYPES, type MealType } from "@/config/constants";
import type { UserProfile, NutritionInfo } from "@/types";

interface RecentMeal {
  id: string;
  mealType: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  foodCount: number;
  firstFoodName: string;
  createdAt: string;
}

interface DashboardSquad {
  code: string;
  name: string;
  role: string;
  memberCount: number;
}

interface DashboardClientProps {
  userName: string;
  profile: UserProfile;
  summary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealsLogged: number;
  };
  recentMeals: RecentMeal[];
  squads: DashboardSquad[];
}

const mealEmoji: Record<string, string> = {
  breakfast: "\u{1F31E}",
  lunch: "\u{1F966}",
  dinner: "\u{1F319}",
  snack: "\u{1F36A}",
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  delay,
}: {
  label: string;
  value: number | string;
  unit?: string;
  icon: typeof Flame;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.35 }}
      className="border-border bg-card flex flex-col justify-between border p-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.15em] uppercase">
          {label}
        </p>
        <Icon className="text-accent-violet h-4 w-4" />
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight tabular-nums sm:text-4xl">
        {value}
        {unit && <span className="text-muted-foreground ml-1 text-sm font-medium">{unit}</span>}
      </p>
    </motion.div>
  );
}

type SelectedFood = {
  foodId: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function DashboardClient({
  userName,
  profile,
  summary,
  recentMeals,
  squads,
}: DashboardClientProps) {
  const router = useRouter();
  const proteinTarget = Math.round((profile.dailyCalGoal * 0.3) / 4);
  const carbsTarget = Math.round((profile.dailyCalGoal * 0.45) / 4);
  const fatTarget = Math.round((profile.dailyCalGoal * 0.25) / 9);
  const calsRemaining = Math.max(profile.dailyCalGoal - summary.totalCalories, 0);
  const levelInfo = getLevelInfo(profile.xp);
  const dailyPct =
    profile.dailyCalGoal > 0 ? Math.round((summary.totalCalories / profile.dailyCalGoal) * 100) : 0;
  const isOver = summary.totalCalories > profile.dailyCalGoal;

  // ── Inline meal logging ──
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [mealSaving, setMealSaving] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  const { data: foodResults, isLoading: searchLoading } = useQuery<NutritionInfo[]>({
    queryKey: ["foods", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await fetch(`/api/foods/list?search=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error("Search failed");
      return (await res.json()).data;
    },
    enabled: debouncedSearch.length >= 2,
  });

  const openMealSheet = useCallback(() => {
    setSelectedFoods([]);
    setSearchQuery("");
    setSheetOpen(true);
  }, []);

  const closeMealSheet = useCallback(() => {
    setSheetOpen(false);
    setSearchQuery("");
    setSelectedFoods([]);
  }, []);

  useEffect(() => {
    if (sheetOpen) requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [sheetOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMealSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeMealSheet]);

  const addFood = (food: NutritionInfo) => {
    if (selectedFoods.some((f) => f.foodId === food.id)) return;
    setSelectedFoods((prev) => [
      ...prev,
      {
        foodId: food.id,
        name: food.name,
        quantity: 1,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
      },
    ]);
  };
  const removeFood = (id: string) => setSelectedFoods((p) => p.filter((f) => f.foodId !== id));
  const updateQty = (id: string, d: number) =>
    setSelectedFoods((p) =>
      p.map((f) => (f.foodId === id ? { ...f, quantity: Math.max(0.5, f.quantity + d) } : f)),
    );
  const selectedTotal = selectedFoods.reduce((s, f) => s + Math.round(f.calories * f.quantity), 0);

  const saveMeal = async () => {
    if (selectedFoods.length === 0) return;
    setMealSaving(true);
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, mealType: activeMealType, foods: selectedFoods }),
      });
      if (!res.ok) throw new Error("Failed");
      closeMealSheet();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setMealSaving(false);
    }
  };

  const challenges = [
    { id: "log-3", title: "Log 3 meals today", xp: 50, progress: summary.mealsLogged, total: 3 },
    {
      id: "hit-cal",
      title: "Hit your calorie goal",
      xp: 25,
      progress: Math.min(summary.totalCalories, profile.dailyCalGoal),
      total: profile.dailyCalGoal,
    },
    {
      id: "protein",
      title: `Hit ${proteinTarget}g protein`,
      xp: 30,
      progress: Math.min(summary.totalProtein, proteinTarget),
      total: proteinTarget,
    },
  ];

  const f = (delay: number) => ({
    initial: { opacity: 0 } as const,
    animate: { opacity: 1 } as const,
    transition: { delay, duration: 0.4 },
  });

  const firstName = userName.split(" ")[0];

  const ringSize = 140;
  const sw = 8;
  const r = (ringSize - sw) / 2;
  const c = 2 * Math.PI * r;
  const ringPct = Math.min(dailyPct, 120);
  const ringOffset = c - (ringPct / 100) * c;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div {...f(0)}>
        <PageModuleHeader
          category={getGreeting()}
          title={firstName}
          meta={
            <>
              <span className="text-accent-violet font-semibold">●</span> {levelInfo.name} ·{" "}
              {profile.streak} day streak
            </>
          }
          description="Track your daily nutrition, earn XP, and level up"
          actions={
            <Button
              variant="default"
              size="sm"
              className="gap-2 px-5 text-sm font-semibold tracking-wider uppercase"
              onClick={openMealSheet}
            >
              <Plus className="h-4 w-4" />
              Log Meal
            </Button>
          }
        />
      </motion.div>

      {/* ── Calories (left) + Macro cards (right) ── */}
      <motion.div {...f(0.05)}>
        <div className="grid gap-4 lg:grid-cols-[350px_1fr]">
          {/* Calories card — ring chart */}
          <div className="border-border bg-card flex flex-col border p-5">
            <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.15em] uppercase">
              Daily Calories
            </p>
            <div className="flex flex-1 items-center gap-4 pt-4 sm:gap-6">
              <div className="relative h-28 w-28 shrink-0 sm:h-[140px] sm:w-[140px]">
                <svg viewBox={`0 0 ${ringSize} ${ringSize}`} className="h-full w-full -rotate-90">
                  <circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={r}
                    fill="none"
                    strokeWidth={sw}
                    className="stroke-border"
                  />
                  <motion.circle
                    cx={ringSize / 2}
                    cy={ringSize / 2}
                    r={r}
                    fill="none"
                    stroke={isOver ? "var(--destructive)" : "var(--accent-violet)"}
                    strokeWidth={sw}
                    strokeLinecap="butt"
                    strokeDasharray={c}
                    initial={{ strokeDashoffset: c }}
                    animate={{ strokeDashoffset: ringOffset }}
                    transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black tabular-nums sm:text-3xl">{dailyPct}%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
                    Consumed
                  </p>
                  <p className="text-2xl font-black tabular-nums">
                    {summary.totalCalories.toLocaleString()}
                    <span className="text-muted-foreground ml-1 text-sm font-medium">kcal</span>
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
                    Remaining
                  </p>
                  <p className="text-2xl font-black tabular-nums">
                    {calsRemaining.toLocaleString()}
                    <span className="text-muted-foreground ml-1 text-sm font-medium">kcal</span>
                  </p>
                </div>
                <p className="text-muted-foreground text-xs tabular-nums">
                  Goal: {profile.dailyCalGoal.toLocaleString()} kcal / day
                </p>
              </div>
            </div>
          </div>

          {/* Right side — 2x2 macro + meals stat cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "Protein",
                value: summary.totalProtein,
                target: proteinTarget,
                emoji: "🍗",
                color: "var(--protein)",
              },
              {
                label: "Carbs",
                value: summary.totalCarbs,
                target: carbsTarget,
                emoji: "🍚",
                color: "var(--carbs)",
              },
              {
                label: "Fat",
                value: summary.totalFat,
                target: fatTarget,
                emoji: "🥑",
                color: "var(--fat)",
              },
              {
                label: "Meals",
                value: summary.mealsLogged,
                target: 0,
                emoji: "🍽️",
                color: "var(--accent-violet)",
              },
            ].map((item) => {
              const pct = item.target > 0 ? Math.min((item.value / item.target) * 100, 100) : 0;
              return (
                <div
                  key={item.label}
                  className="border-border bg-card flex flex-col justify-between border p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.15em] uppercase">
                      {item.label}
                    </p>
                    <span className="text-base leading-none">{item.emoji}</span>
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-black tracking-tight tabular-nums sm:text-3xl">
                      {item.value}
                      {item.target > 0 && (
                        <span className="text-muted-foreground ml-1 text-sm font-medium">
                          /{item.target}g
                        </span>
                      )}
                      {item.label === "Meals" && (
                        <span className="text-muted-foreground ml-1 text-sm font-medium">
                          today
                        </span>
                      )}
                    </p>
                  </div>
                  {item.target > 0 && (
                    <div className="bg-border mt-3 h-1.5 w-full">
                      <motion.div
                        className="h-full"
                        style={{ background: item.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── Activity Metrics ── */}
      <motion.div {...f(0.1)}>
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-[0.2em] uppercase">
          Activity Metrics
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <StatCard
            label="Meals Logged"
            value={summary.mealsLogged}
            icon={UtensilsCrossed}
            delay={0.12}
          />
          <StatCard label="Streak" value={profile.streak} unit="days" icon={Flame} delay={0.14} />
          <StatCard label="XP" value={profile.xp} icon={Zap} delay={0.16} />
        </div>
        <div className="border-accent-violet/40 bg-accent-violet/10 mt-3 border-l-2 px-3 py-2">
          <p className="text-muted-foreground text-[11px]">
            <span className="text-accent-violet font-semibold">XP</span> — earn by logging meals
            (+10), hitting daily goals (+25), maintaining streaks (+5/day), and completing quests
            (+50)
          </p>
        </div>
      </motion.div>

      {/* ── Level + Streak side by side ── */}
      <motion.div {...f(0.15)}>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Level */}
          <div className="border-border bg-card border p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.15em] uppercase">
                Level Progression
              </p>
              <span className="text-accent-violet text-xs font-bold tracking-wider uppercase">
                Lvl {levelInfo.level}
              </span>
            </div>
            <p className="mt-3 text-2xl font-black tracking-tight">{levelInfo.name}</p>
            <div className="bg-border mt-3 h-1.5 w-full">
              <motion.div
                className="bg-accent-violet h-full"
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.xpProgress}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
            <p
              className="text-muted-foreground mt-2 text-xs tabular-nums"
              title="XP (Experience Points) — earn by logging meals, streaks & quests"
            >
              {Math.round(levelInfo.xpProgress)}% to next level · {profile.xp}/
              {levelInfo.xpForNextLevel} xp
            </p>
          </div>

          {/* Streak */}
          <div className="border-border bg-card border p-5">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.15em] uppercase">
                Daily Streak
              </p>
              <span className="text-accent-violet text-xs font-bold tracking-wider uppercase">
                {profile.streak} Days
              </span>
            </div>
            <p className="text-accent-violet mt-3 text-4xl font-black tabular-nums">
              {profile.streak}
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              {profile.streak === 0
                ? "Start logging meals to build momentum"
                : `Keep it up! Log a meal every day to grow your streak.`}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Squads strip ── */}
      <motion.section {...f(0.2)} className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
            Squads
          </p>
          <Link href="/squads">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 gap-1 px-2 text-xs font-semibold tracking-wider uppercase"
            >
              {squads.length > 0 ? "All" : "Explore"} <ChevronRight className="h-3 w-3" />
            </Button>
          </Link>
        </div>

        {squads.length === 0 ? (
          <div className="border-border bg-card flex flex-col gap-4 border p-5 sm:flex-row sm:items-center">
            <Users className="text-accent-violet h-8 w-8 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Track together, stay motivated</p>
              <p className="text-muted-foreground text-sm">Compete with friends on leaderboards.</p>
            </div>
            <Link href="/squads">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 font-semibold tracking-wider uppercase"
              >
                <Plus className="h-4 w-4" /> Join
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {squads.map((squad) => (
              <Link
                key={squad.code}
                href={`/squads/${squad.code}`}
                className="border-border bg-card hover:border-accent-violet/50 max-w-[260px] min-w-[200px] shrink-0 border p-4 transition-colors"
              >
                <div className="mb-2 flex items-center gap-2">
                  {squad.role === "owner" ? (
                    <Crown className="text-accent-violet h-4 w-4" />
                  ) : (
                    <Users className="text-muted-foreground h-4 w-4" />
                  )}
                  <span className="truncate text-sm font-semibold">{squad.name}</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {squad.memberCount} member{squad.memberCount !== 1 ? "s" : ""}
                </p>
              </Link>
            ))}
          </div>
        )}
      </motion.section>

      {/* ── Quests + Recent Meals — side by side ── */}
      <motion.div {...f(0.25)}>
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Quests */}
          <section className="space-y-3">
            <div className="flex min-h-7 items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                Today&apos;s Quests
              </p>
              <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                +XP rewards
              </span>
            </div>
            <div className="border-border divide-border bg-card divide-y border">
              {challenges.map((quest) => {
                const done = quest.progress >= quest.total;
                const pct = Math.min((quest.progress / quest.total) * 100, 100);
                return (
                  <div key={quest.id} className="flex items-center gap-3 p-4">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center border",
                        done ? "border-success bg-success/10" : "border-border",
                      )}
                    >
                      {done && <Check className="text-success h-3.5 w-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "text-sm font-medium",
                          done && "text-muted-foreground line-through",
                        )}
                      >
                        {quest.title}
                      </p>
                      {!done && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <div className="bg-border h-1 flex-1">
                            <motion.div
                              className="bg-accent-violet h-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />
                          </div>
                          <span className="text-muted-foreground text-[10px] tabular-nums">
                            {quest.progress}/{quest.total}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-accent-violet flex items-center gap-0.5 text-xs font-bold">
                      <Zap className="h-3 w-3" />+{quest.xp}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Meals */}
          <section className="space-y-3">
            <div className="flex min-h-7 items-center justify-between">
              <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                Recent Meals
              </p>
              <Link href="/meals">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground h-7 gap-1 px-2 text-xs font-semibold tracking-wider uppercase"
                >
                  All <ChevronRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>

            {recentMeals.length === 0 ? (
              <div className="border-border bg-card flex flex-col items-center gap-3 border py-10 text-center">
                <UtensilsCrossed className="text-muted-foreground h-8 w-8" />
                <p className="text-muted-foreground text-sm font-medium tracking-wider uppercase">
                  No meals logged yet
                </p>
              </div>
            ) : (
              <div className="border-border divide-border bg-card divide-y border">
                {recentMeals.map((meal, i) => (
                  <motion.div
                    key={meal.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
                    className="flex items-center gap-3 p-4"
                  >
                    <span className="text-lg">
                      {mealEmoji[meal.mealType as MealType] ?? "\u{1F37D}"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold capitalize">{meal.mealType}</p>
                      <p className="text-muted-foreground truncate text-xs">
                        {meal.firstFoodName}
                        {meal.foodCount > 1 && ` +${meal.foodCount - 1}`}
                      </p>
                    </div>
                    <span className="text-sm font-black tabular-nums">
                      {meal.totalCalories} cal
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </motion.div>

      {/* ── Inline Meal Sheet ── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={closeMealSheet}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="bg-card border-border fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col border-t shadow-2xl sm:inset-x-0 sm:top-[10vh] sm:bottom-auto sm:mx-auto sm:w-full sm:max-w-lg sm:border"
            >
              <div className="shrink-0 px-5 pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Log Meal</h2>
                  <button
                    type="button"
                    onClick={closeMealSheet}
                    className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {/* Meal type picker */}
                <div className="mt-3 flex gap-1">
                  {MEAL_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveMealType(t)}
                      className={cn(
                        "flex-1 border py-1.5 text-xs font-semibold capitalize transition-colors",
                        activeMealType === t
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-border/40 shrink-0 border-t px-5 py-3">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search foods..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div
                className="flex-1 overflow-y-auto overscroll-contain px-5 py-2"
                style={{ minHeight: "180px" }}
              >
                {searchLoading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
                  </div>
                )}
                {!searchLoading && foodResults && foodResults.length > 0 && (
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-widest uppercase">
                      Results
                    </p>
                    {foodResults.map((food) => {
                      const added = selectedFoods.some((f) => f.foodId === food.id);
                      return (
                        <button
                          key={food.id}
                          onClick={() => addFood(food)}
                          disabled={added}
                          className={cn(
                            "flex w-full items-center justify-between px-3 py-2.5 text-left text-sm transition-colors",
                            added ? "opacity-40" : "hover:bg-muted/60",
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">{food.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {food.servingSize} · P{food.protein} C{food.carbs} F{food.fat}
                            </p>
                          </div>
                          <span className="text-muted-foreground ml-3 shrink-0 text-xs tabular-nums">
                            {food.calories} cal
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {debouncedSearch.length >= 2 && !searchLoading && foodResults?.length === 0 && (
                  <p className="text-muted-foreground py-8 text-center text-sm">No foods found</p>
                )}
                {debouncedSearch.length < 2 && selectedFoods.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Search className="text-muted-foreground/40 mb-3 h-8 w-8" />
                    <p className="text-muted-foreground text-sm">Search for a food to add</p>
                  </div>
                )}
              </div>

              <AnimatePresence>
                {selectedFoods.length > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-border/40 shrink-0 overflow-hidden border-t"
                  >
                    <div className="max-h-40 overflow-y-auto px-5 py-3">
                      <p className="text-muted-foreground mb-2 text-[10px] font-semibold tracking-widest uppercase">
                        Selected
                      </p>
                      <div className="space-y-2">
                        {selectedFoods.map((food) => (
                          <div
                            key={food.foodId}
                            className="bg-muted/40 flex items-center gap-2 px-3 py-2"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">{food.name}</p>
                              <p className="text-muted-foreground text-xs tabular-nums">
                                {Math.round(food.calories * food.quantity)} cal
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => updateQty(food.foodId, -0.5)}
                                className="text-muted-foreground hover:text-foreground flex h-7 w-7 items-center justify-center"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold tabular-nums">
                                {food.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(food.foodId, 0.5)}
                                className="text-muted-foreground hover:text-foreground flex h-7 w-7 items-center justify-center"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFood(food.foodId)}
                              className="text-muted-foreground hover:text-destructive flex h-7 w-7 items-center justify-center"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="border-border/40 shrink-0 border-t px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <Button
                  variant="default"
                  className="w-full"
                  disabled={selectedFoods.length === 0 || mealSaving}
                  onClick={saveMeal}
                >
                  {mealSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UtensilsCrossed className="mr-2 h-4 w-4" />
                  )}
                  {selectedFoods.length > 0 ? `Log ${selectedTotal} cal` : "Log Meal"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
