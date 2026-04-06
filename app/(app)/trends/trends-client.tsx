"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { TrendingUp, Scale } from "lucide-react";
import { PageModuleHeader } from "@/components/layout/page-module-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WeightEntry } from "@/components/weight-entry";
import { cn } from "@/lib/utils";
import type { WeightLog } from "@/types";

interface NutritionDay {
  date: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface TrendsClientProps {
  weightLogs: WeightLog[];
  nutritionTrend: NutritionDay[];
  dailyCalGoal: number;
  targetWeight: number;
  currentWeight: number;
}

type NutritionTab = "calories" | "protein" | "carbs" | "fat";

const nutritionTabs: { key: NutritionTab; label: string; emoji: string; unit: string }[] = [
  { key: "calories", label: "Calories", emoji: "🔥", unit: "cal" },
  { key: "protein", label: "Protein", emoji: "🍗", unit: "g" },
  { key: "carbs", label: "Carbs", emoji: "🍚", unit: "g" },
  { key: "fat", label: "Fat", emoji: "🥑", unit: "g" },
];

function MiniBarChart({
  data,
  dataKey,
  goal,
  unit,
}: {
  data: NutritionDay[];
  dataKey: NutritionTab;
  goal?: number;
  unit: string;
}) {
  const values = data.map((d) => d[dataKey]);
  const max = Math.max(goal ? goal * 1.2 : 0, ...values);
  const goalPct = goal && max > 0 ? Math.min((goal / max) * 100, 100) : 0;
  const avg =
    values.filter((v) => v > 0).length > 0
      ? Math.round(
          values.filter((v) => v > 0).reduce((a, b) => a + b, 0) /
            values.filter((v) => v > 0).length,
        )
      : 0;

  return (
    <div className="space-y-3">
      <div className="text-muted-foreground flex items-center justify-between text-xs">
        <span>
          Avg:{" "}
          <strong className="text-foreground">
            {avg} {unit}
          </strong>
        </span>
        {goal ? (
          <span>
            Goal: {goal} {unit}
          </span>
        ) : null}
      </div>
      <div className="relative" style={{ height: 120 }}>
        {goal && goalPct > 0 && (
          <div
            className="pointer-events-none absolute right-0 left-0 z-10 flex items-center"
            style={{ bottom: `${goalPct}%` }}
          >
            <div className="border-muted-foreground/30 flex-1 border-t border-dashed" />
          </div>
        )}
        <div className="flex h-full items-end gap-[2px]">
          {data.map((day, i) => {
            const val = day[dataKey];
            const height = max > 0 ? Math.max((val / max) * 100, val > 0 ? 3 : 0) : 0;
            const hitGoal = goal ? val >= goal && val > 0 : false;

            return (
              <motion.div
                key={day.date}
                className={cn(
                  "group relative flex-1",
                  val === 0
                    ? "bg-muted/20"
                    : hitGoal
                      ? "bg-success/40"
                      : "bg-bar-fill/30 hover:bg-bar-fill/50",
                )}
                initial={{ height: 0 }}
                animate={{ height: `${height}%` }}
                transition={{ duration: 0.5, delay: i * 0.01, ease: "easeOut" }}
                title={`${day.label}: ${val} ${unit}`}
              />
            );
          })}
        </div>
      </div>
      <div className="text-muted-foreground flex justify-between text-[10px]">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
}

function WeightChart({ logs, targetWeight }: { logs: WeightLog[]; targetWeight: number }) {
  const data = logs.slice(0, 30).reverse();
  if (data.length < 2) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
        Log at least 2 entries to see the chart
      </div>
    );
  }

  const weights = data.map((l) => l.weight);
  const lo = Math.min(...weights, targetWeight) - 1;
  const hi = Math.max(...weights, targetWeight) + 1;
  const range = hi - lo || 1;

  const W = 300;
  const H = 140;
  const px = 8;
  const py = 12;

  const pts = data.map((log, i) => ({
    x: px + (i / (data.length - 1)) * (W - 2 * px),
    y: py + (1 - (log.weight - lo) / range) * (H - 2 * py),
  }));

  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const targetY = py + (1 - (targetWeight - lo) / range) * (H - 2 * py);
  const areaPath = `M${pts[0].x},${H - py} ${pts.map((p) => `L${p.x},${p.y}`).join(" ")} L${pts[pts.length - 1].x},${H - py} Z`;

  return (
    <div className="flex h-full flex-col">
      <svg viewBox={`0 0 ${W} ${H}`} className="flex-1" preserveAspectRatio="none">
        <defs>
          <linearGradient id="wg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-violet)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--accent-violet)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#wg)" />
        <line
          x1={px}
          y1={targetY}
          x2={W - px}
          y2={targetY}
          stroke="var(--success)"
          strokeWidth="1"
          strokeDasharray="4 3"
          opacity="0.6"
        />
        <polyline points={polyline} fill="none" stroke="var(--accent-violet)" strokeWidth="2" />
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="2.5"
            fill="var(--accent-violet)"
            opacity={i === pts.length - 1 ? 1 : 0.5}
          />
        ))}
      </svg>
      <div className="text-muted-foreground flex items-center justify-between pt-1 text-[10px]">
        <span>
          {new Date(data[0].loggedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
        <span className="text-success/80">Target: {targetWeight} kg</span>
        <span>
          {new Date(data[data.length - 1].loggedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}

export function TrendsClient({
  weightLogs,
  nutritionTrend,
  dailyCalGoal,
  targetWeight,
  currentWeight,
}: TrendsClientProps) {
  const router = useRouter();
  const [nutritionTab, setNutritionTab] = useState<NutritionTab>("calories");

  const activeTab = nutritionTabs.find((t) => t.key === nutritionTab)!;

  const anim = (delay: number) => ({
    initial: { opacity: 0 } as const,
    animate: { opacity: 1 } as const,
    transition: { delay, duration: 0.35 },
  });

  return (
    <div className="space-y-6">
      <motion.div {...anim(0)}>
        <PageModuleHeader
          category="Analytics"
          title="Trends"
          description="Visualize your weight and nutrition progress over time"
        />
      </motion.div>

      {/* Nutrition Trends */}
      <motion.div {...anim(0.06)}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-accent-violet h-4 w-4" />
                <CardTitle className="text-base">Nutrition — Last 30 Days</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-border/40 flex gap-1 border p-1">
              {nutritionTabs.map((tab) => {
                const isActive = nutritionTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setNutritionTab(tab.key)}
                    className={cn(
                      "relative z-10 flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors sm:text-sm",
                      isActive
                        ? "text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nutrition-tab"
                        className="bg-accent-violet absolute inset-0"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative text-sm leading-none">{tab.emoji}</span>
                    <span className={cn("relative", !isActive && "max-sm:hidden")}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <MiniBarChart
              data={nutritionTrend}
              dataKey={nutritionTab}
              goal={nutritionTab === "calories" ? dailyCalGoal : undefined}
              unit={activeTab.unit}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Weight History */}
      <motion.div {...anim(0.12)}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Scale className="text-accent-violet h-4 w-4" />
                <CardTitle className="text-base">Weight History</CardTitle>
              </div>
              <div className="text-muted-foreground text-xs">
                {weightLogs.length} entries — Target:{" "}
                <strong className="text-foreground">{targetWeight} kg</strong>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-border/40 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
              <span className="text-muted-foreground text-sm font-medium">Log weight</span>
              <WeightEntry currentWeight={currentWeight} onSaved={() => router.refresh()} />
            </div>

            <div className="grid gap-4 lg:grid-cols-[7fr_3fr]">
              {/* Chart */}
              <div className="h-44">
                <WeightChart logs={weightLogs} targetWeight={targetWeight} />
              </div>

              {/* Scrollable entries */}
              <div className="[&::-webkit-scrollbar-thumb]:bg-border max-h-56 space-y-1 overflow-y-auto [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1">
                {weightLogs.length === 0 ? (
                  <div className="flex items-center justify-center py-8 text-center">
                    <p className="text-muted-foreground text-sm">
                      No weight entries yet. Use the form above to log your first weight.
                    </p>
                  </div>
                ) : (
                  weightLogs.map((log, i) => {
                    const prevLog = weightLogs[i + 1];
                    const diff = prevLog ? log.weight - prevLog.weight : 0;
                    const d = new Date(log.loggedAt);
                    const dateStr = d.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                    const timeStr = d.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    });

                    return (
                      <div
                        key={log.id}
                        className="bg-muted/15 hover:bg-muted/25 flex items-center gap-3 px-3 py-2 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold tabular-nums">{log.weight} kg</span>
                            {diff !== 0 && (
                              <span
                                className={cn(
                                  "text-xs font-medium tabular-nums",
                                  diff > 0 ? "text-destructive" : "text-success",
                                )}
                              >
                                {diff > 0 ? "+" : ""}
                                {diff.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {dateStr} at {timeStr}
                          </p>
                        </div>
                        <div className="text-muted-foreground text-right text-xs tabular-nums">
                          {Math.abs(log.weight - targetWeight).toFixed(1)} kg{" "}
                          {log.weight > targetWeight ? "over" : "to go"}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
