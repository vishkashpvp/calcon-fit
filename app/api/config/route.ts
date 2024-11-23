import { NextRequest, NextResponse } from "next/server";
import { getConfigurationsCollection } from "@lib/db/mongodb";
import { NotFoundError } from "@lib/errors";
import { formatErrorResponse } from "@utils/error-handler";

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
    return formatErrorResponse(err);
  }
}
