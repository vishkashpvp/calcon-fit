import { NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@config/errorMessages";
import { CustomError } from "@lib/errors";

export function formatErrorResponse(err: unknown): NextResponse {
  if (err instanceof CustomError) {
    return NextResponse.json({ message: err.message }, { status: err.status });
  }
  return NextResponse.json({ message: ERROR_MESSAGES.INTERNAL_SERVER }, { status: 500 });
}
