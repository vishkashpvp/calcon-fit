export type UserDetails = {
  weight: number;
  height: number;
  age: number;
  gender?: "male" | "female" | "other";
  activityLevel?: number;
};

export function calculateDailyCalGoal({
  weight,
  height,
  age,
  gender = "other",
  activityLevel = 1.2,
}: UserDetails): number {
  const commonBMR: number = 10 * weight + 6.25 * height - 5 * age;
  const BMR: number = gender === "male" ? commonBMR + 5 : commonBMR - 161;
  const TDEE = BMR * activityLevel;
  return Math.round(TDEE);
}
