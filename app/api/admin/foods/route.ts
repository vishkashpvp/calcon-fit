import { NextRequest, NextResponse } from "next/server";
import { MongoError } from "mongodb";
import { formatErrorResponse } from "@utils/error-handler";
import { getNutrionInfoCollection } from "@lib/db/mongodb";

export async function GET() {
  try {
    const collection = getNutrionInfoCollection();
    const result = await collection.estimatedDocumentCount();
    return NextResponse.json({ result }, { status: 200 });
  } catch (err) {
    return formatErrorResponse(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, calories, protein, carbs, fat, isPlantBased, fiber, sugar } = body;
    if (!name || !calories || !protein || !carbs || !fat || !isPlantBased || !sugar || !fiber) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const createdAt = new Date().toISOString();
    const collection = getNutrionInfoCollection();
    const newFood = {
      name,
      calories,
      isPlantBased,
      macros: { protein, carbs, fat },
      metadata: { sugar, fiber },
      createdAt,
      updatedAt: createdAt,
    };
    const result = await collection.insertOne(newFood);
    return NextResponse.json(
      { message: "Food item added successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof MongoError && error.code === 11000) {
      return NextResponse.json(
        { error: "Food item with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Failed to add food item" }, { status: 500 });
  }
}
