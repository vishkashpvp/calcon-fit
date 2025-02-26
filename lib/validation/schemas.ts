import { z } from "zod";
import { CONSTANTS } from "@config/constants";
import { MESSAGES } from "@config/messages";

export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, MESSAGES.INVALID_DATE_FORMAT);

export const createMealPayloadSchema = z.object({
  mealType: z.enum(CONSTANTS.MEAL_TYPES),
  foods: z
    .array(z.object({ foodId: z.string(), quantity: z.number().positive() }))
    .min(1, MESSAGES.MEAL_LOG_MIN_ONE_FOOD),
  customCalories: z.number().nonnegative().optional(),
});
