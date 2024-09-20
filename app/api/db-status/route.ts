import { NextResponse } from "next/server";
import clientPromise from "@lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    await client!.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
    return NextResponse.json({ message: "Database connected!" });
  } catch (error) {
    console.error("DB connection error:", error);
    return NextResponse.json({ message: "Error connecting to the database" }, { status: 500 });
  }
}
