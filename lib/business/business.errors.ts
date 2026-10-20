import { ApiError } from "@/lib/api/api-error";

const BUSINESS_ERROR_STATUS: Record<BusinessErrorCode, number> = {
  INVALID_INPUT: 400,
  BUSINESS_SLUG_EXISTS: 409,
  OWNER_ROLE_NOT_FOUND: 500,
  STARTER_PLAN_NOT_FOUND: 500,
  USER_NOT_FOUND: 401,
  BUSINESS_CREATION_FAILED: 500,
};

export type BusinessErrorCode =
  | "INVALID_INPUT"
  | "BUSINESS_SLUG_EXISTS"
  | "OWNER_ROLE_NOT_FOUND"
  | "STARTER_PLAN_NOT_FOUND"
  | "USER_NOT_FOUND"
  | "BUSINESS_CREATION_FAILED";

export class BusinessError extends ApiError {
  constructor(
    message: string,
    public readonly code: BusinessErrorCode,
    options?: ErrorOptions,
  ) {
    super(message, code, BUSINESS_ERROR_STATUS[code], undefined, options);
  }
}
