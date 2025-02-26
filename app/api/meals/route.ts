import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { MESSAGES } from "@/config/messages";
import { getMealLogsCollection } from "@/lib/db/mongodb";
import { BadRequestError, NotFoundError, UnauthorizedError } from "@lib/errors";
import { dateSchema } from "@lib/validation/schemas";
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
