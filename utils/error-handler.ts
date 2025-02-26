import { NextResponse } from "next/server";
import { ERROR_MESSAGES } from "@config/errorMessages";
import { CustomError } from "@lib/errors";

export function formatErrorResponse(err: unknown): NextResponse {
  const {
    message = ERROR_MESSAGES.INTERNAL_SERVER,
    status = 500,
    errors = [],
  } = err instanceof CustomError ? err : err instanceof Error ? { message: err.message } : {};
  return NextResponse.json({ message, errors }, { status });
}
