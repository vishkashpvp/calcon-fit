import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { updateUserProfile } from "@lib/db/user";
import { getAuthSecret } from "@utils/env";

export async function POST(request: Request) {
  try {
    const token = await getToken({ req: request, secret: getAuthSecret() });
    if (!token || !token.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    const userId = token.id;
    const data = await request.json();
    // TODO: validate these data
    const { currentWeight, targetWeight, height } = data;
    const result = await updateUserProfile(userId, { currentWeight, targetWeight, height });
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Profile updated" }, { status: 200 });
    }
    return NextResponse.json({ message: "No changes were made" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update profile" }, { status: 500 });
  }
}
