import { NextRequest, NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@config/errorMessages";
import { getConfigurationsCollection } from "@lib/db/mongodb";
import { CustomError, NotFoundError } from "@lib/errors";

export async function GET(request: NextRequest) {
  try {
    const name = request.nextUrl.searchParams.get("name");
    const filter = name ? { name } : {};
    const projection = name ? { _id: 0 } : { name: 1, _id: 0 };
    const collection = getConfigurationsCollection();
    const data = await collection.find(filter).project(projection).toArray();
    if (name && !data.length) throw new NotFoundError();
    const result = name ? data[0] : data.map((doc) => doc.name);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    if (err instanceof CustomError) {
      return NextResponse.json({ message: err.message }, { status: err.status });
    }
    return NextResponse.json({ message: ERROR_MESSAGES.INTERNAL_SERVER }, { status: 500 });
  }
}
