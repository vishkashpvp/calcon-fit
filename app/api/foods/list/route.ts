import { NextRequest, NextResponse } from "next/server";
import { getNutritionInfoCollection } from "@lib/db/mongodb";
import { formatErrorResponse } from "@utils/error-handler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "10", 10));
    const skip = (page - 1) * limit;
    const collection = getNutritionInfoCollection();
    const query = name ? { name: { $regex: name, $options: "i" } } : {};
    const projection = { _id: 1, name: 1, calories: 1, isPlantBased: 1 };
    const [total, items] = await Promise.all([
      collection.countDocuments(query),
      collection.find(query).project(projection).skip(skip).limit(limit).toArray(),
    ]);
    return NextResponse.json({ total, page, limit, items });
  } catch (err) {
    return formatErrorResponse(err);
  }
}
