import { GAMIFICATION } from "@/config/constants";

export function getLevelInfo(xp: number) {
  const levels = GAMIFICATION.LEVELS;
  let current: (typeof levels)[number] = levels[0];
  for (const lvl of levels) {
    if (xp >= lvl.minXp) current = lvl;
    else break;
  }
  const nextLevel = levels.find((l) => l.level === current.level + 1);
  const xpForNext = nextLevel ? nextLevel.minXp : current.minXp;
  const xpInCurrentLevel = xp - current.minXp;
  const xpNeededForNext = xpForNext - current.minXp;
  const progress = xpNeededForNext > 0 ? (xpInCurrentLevel / xpNeededForNext) * 100 : 100;

  return {
    level: current.level,
    name: current.name,
    color: current.color,
    xpForNextLevel: xpForNext,
    xpProgress: Math.min(progress, 100),
    isMaxLevel: !nextLevel,
  };
}

export function calculateDailyCalGoal(opts: {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female" | "other";
  activityLevel: number;
  targetWeight?: number;
}): number {
  const baseBmr = 10 * opts.weight + 6.25 * opts.height - 5 * opts.age;
  const bmr = opts.gender === "male" ? baseBmr + 5 : baseBmr - 161;
  const tdee = Math.round(bmr * opts.activityLevel);
  if (opts.targetWeight && opts.targetWeight !== opts.weight) {
    return opts.targetWeight < opts.weight ? Math.max(1200, tdee - 500) : tdee + 300;
  }
  return tdee;
}
