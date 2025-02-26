import { ERROR_MESSAGES } from "@config/errorMessages";

export class CustomError extends Error {
  public status: number;
  public errors: unknown;
  constructor(message: string, status: number = 400, errors: unknown = []) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export class EnvironmentVariableError extends CustomError {
  constructor(variable: string) {
    super(`${variable} is not defined in environment variables`, 500);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = ERROR_MESSAGES.BAD_REQUEST, errors: unknown = []) {
    super(message, 400, errors);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, 404);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string = ERROR_MESSAGES.CONFLICT) {
    super(message, 409);
  }
}

export class InternalServerError extends CustomError {
  constructor(message: string = ERROR_MESSAGES.INTERNAL_SERVER) {
    super(message, 500);
  }
}

export class ServiceUnavailableError extends CustomError {
  constructor(message: string = ERROR_MESSAGES.SERVICE_UNAVAILABLE) {
    super(message, 503);
  }
}
