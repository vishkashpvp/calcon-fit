import { z } from "zod";
import { MEAL_TYPES } from "@/config/constants";
import { MESSAGES } from "@/config/messages";

export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, MESSAGES.VALIDATION.INVALID_DATE_FORMAT);

export const createMealSchema = z.object({
  date: dateSchema,
  mealType: z.enum(MEAL_TYPES),
  foods: z
    .array(
      z.object({
        foodId: z.string().min(1),
        name: z.string().min(1),
        quantity: z.number().positive(),
        calories: z.number().nonnegative(),
        protein: z.number().nonnegative(),
        carbs: z.number().nonnegative(),
        fat: z.number().nonnegative(),
      }),
    )
    .min(1, MESSAGES.VALIDATION.MEAL_MIN_ONE_FOOD),
});

export const profileSetupSchema = z.object({
  currentWeight: z.number().positive(MESSAGES.VALIDATION.POSITIVE_NUMBER),
  targetWeight: z.number().positive(MESSAGES.VALIDATION.POSITIVE_NUMBER),
  height: z.number().positive(MESSAGES.VALIDATION.POSITIVE_NUMBER),
  age: z.number().int().positive(MESSAGES.VALIDATION.POSITIVE_NUMBER),
  gender: z.enum(["male", "female", "other"]),
  activityLevel: z.number().min(1).max(2),
});

export type CreateMealPayload = z.infer<typeof createMealSchema>;
export type ProfileSetupPayload = z.infer<typeof profileSetupSchema>;
