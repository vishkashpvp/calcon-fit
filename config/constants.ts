import { env } from "@/env";

export const APP = {
  NAME: "CalConFit",
  DESCRIPTION: "Level up your nutrition. Track calories, build streaks, earn XP.",
  URL: env.NEXT_PUBLIC_APP_URL,
} as const;

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export const ACTIVITY_LEVELS = [
  { value: 1.2, label: "Sedentary", description: "Little or no exercise" },
  { value: 1.375, label: "Lightly Active", description: "1-3 days/week" },
  { value: 1.55, label: "Moderately Active", description: "3-5 days/week" },
  { value: 1.725, label: "Very Active", description: "6-7 days/week" },
  { value: 1.9, label: "Extremely Active", description: "Intense daily training" },
] as const;

export const GAMIFICATION = {
  XP_PER_MEAL_LOG: 10,
  XP_PER_GOAL_HIT: 25,
  XP_PER_STREAK_DAY: 5,
  XP_PER_CHALLENGE: 50,
  MAX_STREAK_XP_MULTIPLIER: 10,
  LEVELS: [
    { level: 1, name: "Rookie", minXp: 0, color: "text-muted-foreground" },
    { level: 2, name: "Explorer", minXp: 100, color: "text-accent-violet" },
    { level: 3, name: "Warrior", minXp: 300, color: "text-accent-violet" },
    { level: 4, name: "Champion", minXp: 600, color: "text-accent-violet" },
    { level: 5, name: "Legend", minXp: 1000, color: "text-accent-violet" },
    { level: 6, name: "MOMA", minXp: 2000, color: "text-accent-violet" },
  ],
} as const;
