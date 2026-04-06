"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Loader2,
  Moon,
  Sun,
  Monitor,
  Save,
  Palette,
  Dumbbell,
  Lock,
  Check,
  Sparkles,
  PanelLeft,
} from "lucide-react";
import { ACTIVITY_LEVELS, GAMIFICATION } from "@/config/constants";
import { COLOR_PRESETS } from "@/config/colors";
import { useAccentColor } from "@/components/providers/color-provider";
import { getLevelInfo } from "@/lib/gamification";
import { PageModuleHeader } from "@/components/layout/page-module-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getSidebarPositionSnapshot,
  getSidebarPositionServerSnapshot,
  setSidebarPosition,
  subscribeSidebarPosition,
} from "@/lib/sidebar-position";
import type { UserProfile } from "@/types";

interface SettingsClientProps {
  user: { name: string; email: string; image: string | null };
  profile: UserProfile | null;
}

function SectionHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof Palette;
  title: string;
  desc?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-accent-violet/10 flex h-8 w-8 items-center justify-center">
        <Icon className="text-accent-violet h-4 w-4" />
      </div>
      <div>
        <h2 className="text-sm font-semibold tracking-wide sm:text-base">{title}</h2>
        {desc && <p className="text-muted-foreground text-sm">{desc}</p>}
      </div>
    </div>
  );
}

export function SettingsClient({ user, profile }: SettingsClientProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { activeColorId, setColor } = useAccentColor();
  const userLevel = getLevelInfo(profile?.xp ?? 0).level;
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    currentWeight: profile?.currentWeight?.toString() ?? "",
    targetWeight: profile?.targetWeight?.toString() ?? "",
    height: profile?.height?.toString() ?? "",
    age: profile?.age?.toString() ?? "",
    gender: profile?.gender ?? "other",
    activityLevel: profile?.activityLevel ?? 1.55,
  });
  const [calGoal, setCalGoal] = useState(profile?.dailyCalGoal ?? 0);
  const sidebarPosition = useSyncExternalStore(
    subscribeSidebarPosition,
    getSidebarPositionSnapshot,
    getSidebarPositionServerSnapshot,
  );

  useEffect(() => setMounted(true), []);

  const update = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/profile/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentWeight: parseFloat(form.currentWeight),
          targetWeight: parseFloat(form.targetWeight),
          height: parseFloat(form.height),
          age: parseInt(form.age),
          gender: form.gender,
          activityLevel: form.activityLevel,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const { data } = await res.json();
      if (data?.dailyCalGoal) setCalGoal(data.dailyCalGoal);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 3000);
    } catch {
      /* handled silently */
    } finally {
      setSaving(false);
    }
  };

  const themes = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  const anim = (delay: number) => ({
    initial: { opacity: 0 } as const,
    animate: { opacity: 1 } as const,
    transition: { delay, duration: 0.35 },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div {...anim(0)}>
        <PageModuleHeader
          category="Settings"
          title="Settings"
          description="Customize your goals, theme, and preferences"
        />
      </motion.div>

      {/* Body & Goals */}
      {profile && (
        <motion.div {...anim(0.06)}>
          <Card>
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionHeader
                  icon={Dumbbell}
                  title="Body & Goals"
                  desc="Recalculate your daily calorie goal"
                />
                <div className="text-right">
                  <p className="text-2xl font-black tabular-nums">
                    {calGoal > 0 ? calGoal.toLocaleString() : "—"}
                  </p>
                  <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    cal / day
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                <div className="space-y-1">
                  <Label htmlFor="sw" className="text-xs tracking-wider uppercase">
                    Weight (kg)
                  </Label>
                  <Input
                    id="sw"
                    type="number"
                    step="0.1"
                    value={form.currentWeight}
                    onChange={(e) => update("currentWeight", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="tw" className="text-xs tracking-wider uppercase">
                    Target (kg)
                  </Label>
                  <Input
                    id="tw"
                    type="number"
                    step="0.1"
                    value={form.targetWeight}
                    onChange={(e) => update("targetWeight", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ht" className="text-xs tracking-wider uppercase">
                    Height (cm)
                  </Label>
                  <Input
                    id="ht"
                    type="number"
                    value={form.height}
                    onChange={(e) => update("height", e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ag" className="text-xs tracking-wider uppercase">
                    Age
                  </Label>
                  <Input
                    id="ag"
                    type="number"
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs tracking-wider uppercase">Gender</Label>
                  <div className="border-border/50 relative flex gap-0.5 border p-0.5">
                    {(["male", "female", "other"] as const).map((g) => {
                      const isActive = form.gender === g;
                      return (
                        <button
                          key={g}
                          onClick={() => update("gender", g)}
                          className={`relative z-10 flex-1 py-1.5 text-xs font-semibold capitalize transition-colors ${isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="gender-pill"
                              className="bg-accent-violet absolute inset-0"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <span className="relative">{g}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs tracking-wider uppercase">Activity Level</Label>
                  <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
                    {ACTIVITY_LEVELS.map((level) => {
                      const isActive = form.activityLevel === level.value;
                      return (
                        <button
                          key={level.value}
                          onClick={() => update("activityLevel", level.value)}
                          className={`border px-2 py-1.5 text-left transition-all ${isActive ? "border-accent-violet bg-accent-violet text-primary-foreground" : "border-border/50 hover:border-border hover:bg-muted/30"}`}
                        >
                          <p
                            className={`text-xs font-semibold ${isActive ? "text-primary-foreground" : ""}`}
                          >
                            {level.label}
                          </p>
                          <p
                            className={`text-xs leading-tight ${isActive ? "text-primary-foreground/60" : "text-muted-foreground"}`}
                          >
                            {level.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Button variant="glow" size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="mr-2 h-3.5 w-3.5" />
                )}
                {saved ? "Saved!" : "Save & Recalculate"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Appearance + Accent in one card */}
      <motion.div {...anim(0.12)}>
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* Theme */}
              <div className="space-y-3">
                <SectionHeader icon={Palette} title="Theme" />
                <div className="border-border/50 relative flex gap-1 border p-1">
                  {themes.map((t) => {
                    const isActive = mounted && theme === t.value;
                    return (
                      <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="theme-pill"
                            className="bg-accent-violet absolute inset-0"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <t.icon className="relative h-4 w-4" />
                        <span className={`relative ${!isActive ? "max-sm:hidden" : ""}`}>
                          {t.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Position */}
              <div className="space-y-3">
                <SectionHeader icon={PanelLeft} title="Sidebar Position" />
                <div className="border-border/50 relative flex gap-1 border p-1">
                  {(["left", "right"] as const).map((pos) => {
                    const isActive = mounted && sidebarPosition === pos;
                    return (
                      <button
                        key={pos}
                        onClick={() => setSidebarPosition(pos)}
                        className={`relative z-10 flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium capitalize transition-colors ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="sidebar-pos-pill"
                            className="bg-accent-violet absolute inset-0"
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <span className="relative">{pos}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Accent color */}
            <div className="border-border/40 mt-5 space-y-3 border-t pt-5">
              <SectionHeader
                icon={Sparkles}
                title="Accent Color"
                desc="Unlock more by leveling up"
              />
              <div className="grid grid-cols-5 gap-3 sm:grid-cols-6 lg:grid-cols-8">
                {COLOR_PRESETS.map((preset) => {
                  const isActive = activeColorId === preset.id;
                  const isLocked = !preset.free && userLevel < (preset.unlockLevel ?? 99);
                  const unlockLevelInfo = preset.unlockLevel
                    ? GAMIFICATION.LEVELS.find((l) => l.level === preset.unlockLevel)
                    : null;
                  const isDefault = preset.id === "default";

                  return (
                    <button
                      key={preset.id}
                      disabled={isLocked}
                      onClick={() => setColor(preset.id)}
                      className="group relative flex flex-col items-center gap-1.5"
                      title={
                        isLocked
                          ? `Unlock at Lv ${preset.unlockLevel} (${unlockLevelInfo?.name})`
                          : preset.name
                      }
                    >
                      <div
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                          isActive
                            ? "border-foreground scale-110"
                            : isLocked
                              ? "border-border/50 opacity-60"
                              : "hover:border-border border-transparent hover:scale-105"
                        }`}
                      >
                        {isDefault ? (
                          <div
                            className="h-7 w-7 overflow-hidden rounded-full"
                            style={{
                              background: `linear-gradient(135deg, oklch(0.15 0 0), oklch(0.85 0 0))`,
                            }}
                          />
                        ) : (
                          <div
                            className="h-7 w-7 rounded-full"
                            style={{ backgroundColor: preset.swatch }}
                          />
                        )}
                        {isActive && (
                          <Check className="absolute h-3.5 w-3.5 text-white drop-shadow-md" />
                        )}
                        {isLocked && (
                          <div className="bg-background/80 absolute flex h-5 w-5 items-center justify-center rounded-full backdrop-blur-sm">
                            <Lock className="text-foreground/70 h-3 w-3" />
                          </div>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">{preset.name}</span>
                      {isLocked && unlockLevelInfo && (
                        <span className="text-muted-foreground/60 text-xs leading-tight">
                          Lv {preset.unlockLevel}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
