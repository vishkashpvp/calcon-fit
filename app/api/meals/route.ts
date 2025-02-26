import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { MESSAGES } from "@/config/messages";
import { getMealLogsCollection } from "@/lib/db/mongodb";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@lib/errors";
import { createMealPayloadSchema, dateSchema } from "@lib/validation/schemas";
import { getAuthSecret } from "@utils/env";
import { formatErrorResponse } from "@utils/error-handler";

const mealLogsCollection = getMealLogsCollection();

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getAuthSecret() });
    if (!token || !token.id) throw new UnauthorizedError();
    const userId = token.id;
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date")?.trim();
    if (!date || !dateSchema.safeParse(date).success) {
      throw new BadRequestError(MESSAGES.INVALID_DATE_FORMAT);
    }
    const meal = await mealLogsCollection.findOne({ userId, date });
    if (!meal) throw new NotFoundError(MESSAGES.MEAL_LOG_NOT_FOUND);
    return NextResponse.json(meal, { status: 200 });
  } catch (err) {
    return formatErrorResponse(err);
  }
}

// TODO: calculate calories at mealType level and also totalCalories
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getAuthSecret() });
    if (!token || !token.id) throw new UnauthorizedError();
    const userId = token.id;
    const body = await req.json().catch(() => null);
    const parsed = createMealPayloadSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestError(MESSAGES.MEAL_LOG_DATA_INVALID);
    const { mealType, foods, customCalories } = parsed.data;
    const date = new Date().toISOString().split("T")[0];
    const existingMealLog = await mealLogsCollection.findOne({ userId, date });
    if (!existingMealLog) {
      const mealLog = {
        userId,
        date,
        meals: { [mealType]: { foods, calories: 0 } },
        customCalories: { [mealType]: customCalories ?? 0 },
        totalCalories: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await mealLogsCollection.insertOne(mealLog);
      return NextResponse.json({ mealLog, message: MESSAGES.MEAL_LOG_CREATED }, { status: 201 });
    }
    if (existingMealLog.meals?.[mealType]) {
      throw new BadRequestError(MESSAGES.MEAL_LOG_ALREADY_EXISTS);
    }
    await mealLogsCollection.updateOne(
      { userId, date },
      {
        $set: {
          [`meals.${mealType}`]: { foods, calories: 0 },
          [`customCalories.${mealType}`]: customCalories ?? 0,
          totalCalories: 0,
          updatedAt: new Date(),
        },
      }
    );
    return NextResponse.json({ message: MESSAGES.MEAL_LOG_UPDATED }, { status: 200 });
  } catch (err) {
    return formatErrorResponse(err);
  }
}
