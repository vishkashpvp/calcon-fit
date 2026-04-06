"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X, Loader2, UtensilsCrossed, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MEAL_TYPES, type MealType } from "@/config/constants";
import type { MealLog, NutritionInfo } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { PageModuleHeader } from "@/components/layout/page-module-header";
import { cn } from "@/lib/utils";

type SelectedFood = {
  foodId: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

interface MealsClientProps {
  userId: string;
  dailyCalGoal: number;
  meals: MealLog[];
  date: string;
}

const mealMeta: Record<MealType, { emoji: string; label: string }> = {
  breakfast: { emoji: "\u{1F31E}", label: "Breakfast" },
  lunch: { emoji: "\u{1F966}", label: "Lunch" },
  dinner: { emoji: "\u{1F319}", label: "Dinner" },
  snack: { emoji: "\u{1F36A}", label: "Snack" },
};

export function MealsClient({ dailyCalGoal, meals: initialMeals, date }: MealsClientProps) {
  const router = useRouter();
  const [meals, setMeals] = useState(initialMeals);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState<MealType>("breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [saving, setSaving] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLInputElement>(null);

  const totals = meals.reduce(
    (acc, m) => ({
      calories: acc.calories + m.totalCalories,
      protein: acc.protein + m.totalProtein,
      carbs: acc.carbs + m.totalCarbs,
      fat: acc.fat + m.totalFat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
  const calPct =
    dailyCalGoal > 0 ? Math.min(Math.round((totals.calories / dailyCalGoal) * 100), 100) : 0;
  const remaining = Math.max(dailyCalGoal - totals.calories, 0);
  const isOver = totals.calories > dailyCalGoal;

  const { data: foodResults, isLoading: searchLoading } = useQuery<NutritionInfo[]>({
    queryKey: ["foods", debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await fetch(`/api/foods/list?search=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error("Failed");
      return (await res.json()).data;
    },
    enabled: debouncedSearch.length >= 2,
  });

  const openSheet = (type: MealType) => {
    setActiveMealType(type);
    setSelectedFoods([]);
    setSearchQuery("");
    setSheetOpen(true);
  };
  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setSearchQuery("");
    setSelectedFoods([]);
  }, []);
  useEffect(() => {
    if (sheetOpen) requestAnimationFrame(() => searchRef.current?.focus());
  }, [sheetOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeSheet]);

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
  const removeFood = (foodId: string) =>
    setSelectedFoods((prev) => prev.filter((f) => f.foodId !== foodId));
  const updateQuantity = (foodId: string, delta: number) =>
    setSelectedFoods((prev) =>
      prev.map((f) =>
        f.foodId === foodId ? { ...f, quantity: Math.max(0.5, f.quantity + delta) } : f,
      ),
    );
  const selectedTotal = selectedFoods.reduce((s, f) => s + Math.round(f.calories * f.quantity), 0);

  const saveMeal = async () => {
    if (selectedFoods.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, mealType: activeMealType, foods: selectedFoods }),
      });
      if (!res.ok) throw new Error("Failed");
      const { data } = await res.json();
      setMeals((prev) => [...prev, data]);
      closeSheet();
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const mealsByType = (type: MealType) => meals.filter((m) => m.mealType === type);
  const allEmpty = meals.length === 0;

  const f = (delay: number) => ({
    initial: { opacity: 0 } as const,
    animate: { opacity: 1 } as const,
    transition: { delay, duration: 0.35 },
  });

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div {...f(0)}>
        <PageModuleHeader
          category="Meals"
          title={new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
          description="Log and track everything you eat today"
        />
      </motion.div>

      {/* ── Summary: calories left + macros right ── */}
      <motion.div {...f(0.05)}>
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="border-border bg-card flex items-center gap-5 border p-5">
            <div className="relative h-16 w-16 shrink-0">
              <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  strokeWidth="3"
                  className="stroke-border"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.5"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="butt"
                  strokeDasharray={2 * Math.PI * 15.5}
                  strokeDashoffset={2 * Math.PI * 15.5 * (1 - calPct / 100)}
                  className={isOver ? "stroke-destructive" : "stroke-accent-violet"}
                  style={{ transition: "stroke-dashoffset 0.7s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black tabular-nums">{calPct}%</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-black tabular-nums">
                {totals.calories.toLocaleString()}
                <span className="text-muted-foreground ml-1 text-sm font-normal">
                  / {dailyCalGoal.toLocaleString()}
                </span>
              </p>
              <p className={cn("text-sm", isOver ? "text-destructive" : "text-muted-foreground")}>
                {isOver
                  ? `${(totals.calories - dailyCalGoal).toLocaleString()} over`
                  : remaining > 0
                    ? `${remaining.toLocaleString()} remaining`
                    : "Goal reached"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {[
              { label: "Protein", value: totals.protein, emoji: "🍗" },
              { label: "Carbs", value: totals.carbs, emoji: "🍚" },
              { label: "Fat", value: totals.fat, emoji: "🥑" },
            ].map((m) => (
              <div
                key={m.label}
                className="border-border bg-card flex flex-col justify-between border p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-[10px] font-semibold tracking-[0.15em] uppercase">
                    {m.label}
                  </p>
                  <span className="text-sm leading-none">{m.emoji}</span>
                </div>
                <p className="mt-3 text-2xl font-black tabular-nums">
                  {m.value}
                  <span className="text-muted-foreground ml-0.5 text-xs font-medium">g</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Meal type tab bar + Add ── */}
      <motion.div
        {...f(0.1)}
        className="border-border flex items-center gap-1 overflow-x-auto border-b pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {MEAL_TYPES.map((type) => {
          const count = mealsByType(type).length;
          return (
            <button
              key={type}
              type="button"
              onClick={() => openSheet(type)}
              className="text-muted-foreground hover:text-foreground group flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors"
            >
              <span>{mealMeta[type].emoji}</span>
              <span className="capitalize">{type}</span>
              {count > 0 && (
                <span className="bg-accent-violet/15 text-accent-violet ml-0.5 px-1.5 py-0.5 text-[10px] font-bold tabular-nums">
                  {count}
                </span>
              )}
              <Plus className="text-muted-foreground/50 group-hover:text-accent-violet h-3.5 w-3.5 transition-colors" />
            </button>
          );
        })}
      </motion.div>

      {/* ── Unified meal list — one continuous flow ── */}
      <motion.div {...f(0.15)}>
        {allEmpty ? (
          <div className="border-border bg-card flex flex-col items-center gap-4 border py-14 text-center">
            <UtensilsCrossed className="text-muted-foreground h-10 w-10" />
            <div>
              <p className="font-semibold">No meals logged yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Tap a meal type above to start tracking
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {MEAL_TYPES.map((type) => {
              const typeMeals = mealsByType(type);
              if (typeMeals.length === 0) return null;
              const typeCals = typeMeals.reduce((s, m) => s + m.totalCalories, 0);

              return (
                <div key={type}>
                  {/* Section label */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{mealMeta[type].emoji}</span>
                      <p className="text-sm font-semibold capitalize">{type}</p>
                      <span className="text-muted-foreground text-xs tabular-nums">
                        {typeCals} cal
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openSheet(type)}
                      className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                    >
                      + Add
                    </button>
                  </div>

                  {/* Items */}
                  <div className="border-border divide-border bg-card divide-y border">
                    {typeMeals.map((meal, idx) =>
                      meal.foods.map((food) => (
                        <div
                          key={`${idx}-${food.foodId}`}
                          className="flex items-center justify-between px-4 py-3 text-sm"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="font-medium">{food.name}</p>
                            <p className="text-muted-foreground text-xs">
                              {food.quantity} serving{food.quantity > 1 ? "s" : ""} · P
                              {Math.round(food.protein * food.quantity)} C
                              {Math.round(food.carbs * food.quantity)} F
                              {Math.round(food.fat * food.quantity)}
                            </p>
                          </div>
                          <span className="text-muted-foreground ml-3 shrink-0 font-semibold tabular-nums">
                            {Math.round(food.calories * food.quantity)} cal
                          </span>
                        </div>
                      )),
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* ── Add Meal Sheet ── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={closeSheet}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="bg-card border-border fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col border-t shadow-2xl sm:inset-x-0 sm:top-[10vh] sm:bottom-auto sm:mx-auto sm:w-full sm:max-w-lg sm:border"
            >
              {/* Header + meal type switcher */}
              <div className="shrink-0 px-5 pt-4 pb-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-semibold">Log Meal</h2>
                  <button
                    type="button"
                    onClick={closeSheet}
                    className="text-muted-foreground hover:text-foreground flex h-8 w-8 items-center justify-center"
                    aria-label="Close"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
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
                      {mealMeta[t].emoji} {t}
                    </button>
                  ))}
                </div>
                {selectedFoods.length > 0 && (
                  <p className="text-muted-foreground mt-2 text-xs tabular-nums">
                    {selectedFoods.length} item{selectedFoods.length > 1 ? "s" : ""} ·{" "}
                    {selectedTotal} cal
                  </p>
                )}
              </div>

              {/* Search */}
              <div className="border-border/40 shrink-0 border-t px-5 py-3">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    ref={searchRef}
                    placeholder="Search foods..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Results */}
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

              {/* Selected */}
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
                                onClick={() => updateQuantity(food.foodId, -0.5)}
                                className="text-muted-foreground hover:text-foreground flex h-7 w-7 items-center justify-center"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-semibold tabular-nums">
                                {food.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(food.foodId, 0.5)}
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

              {/* CTA */}
              <div className="border-border/40 shrink-0 border-t px-5 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <Button
                  variant="default"
                  className="w-full"
                  disabled={selectedFoods.length === 0 || saving}
                  onClick={saveMeal}
                >
                  {saving ? (
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
