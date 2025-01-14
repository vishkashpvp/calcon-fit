import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getNutritionInfoCollection } from "@lib/db/mongodb";
import { BadRequestError, NotFoundError } from "@lib/errors";
import { formatErrorResponse } from "@utils/error-handler";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!ObjectId.isValid(id)) throw new BadRequestError("Invalid food ID format");
    const collection = getNutritionInfoCollection();
    const foodItem = await collection.findOne({ _id: new ObjectId(id) });
    if (!foodItem) throw new NotFoundError("Food item not found");
    return NextResponse.json(foodItem);
  } catch (err) {
    return formatErrorResponse(err);
  }
}
