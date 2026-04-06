import type { MealType } from "@/config/constants";

export interface UserProfile {
  id: string;
  userId: string;
  currentWeight: number;
  targetWeight: number;
  startWeight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: number;
  dailyCalGoal: number;
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastLogDate: string | null;
  isProfileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WeightLog {
  id: string;
  userId: string;
  weight: number;
  note: string | null;
  loggedAt: string;
  createdAt: string;
}

export interface MealLog {
  id: string;
  userId: string;
  date: string;
  mealType: MealType;
  foods: MealFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  createdAt: string;
}

export interface MealFood {
  id: string;
  mealLogId: string;
  foodId: string;
  name: string;
  quantity: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionInfo {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  category: string;
}

export interface Squad {
  id: string;
  name: string;
  code: string;
  description: string | null;
  createdBy: string;
  maxMembers: number;
  createdAt: string;
  memberCount: number;
}

export interface SquadMember {
  id: string;
  squadId: string;
  userId: string;
  role: string;
  joinedAt: string;
  user: {
    name: string;
    image: string | null;
  };
  profile: {
    dailyCalGoal: number;
    streak: number;
    xp: number;
    level: number;
  } | null;
  todayCalories: number;
  todayProtein: number;
}
