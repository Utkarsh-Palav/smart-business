import { NextResponse } from "next/server";
import { ApiError } from "./api-error";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  code: string,
  message: string,
  status: number,
  details?: unknown,
) {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    },
    { status },
  );
}

export function unauthorizedResponse() {
  return errorResponse(
    "UNAUTHORIZED",
    "Authentication is required.",
    401,
  );
}

export function validationResponse(message: string, details?: unknown) {
  return errorResponse("VALIDATION_ERROR", message, 400, details);
}

export function notImplementedResponse(message: string) {
  return errorResponse("NOT_IMPLEMENTED", message, 501);
}

export function handleApiError(
  error: unknown,
  fallbackCode: string,
  fallbackMessage: string,
  fallbackStatus = 500,
) {
  if (error instanceof ApiError) {
    return errorResponse(error.code, error.message, error.status, error.details);
  }

  console.error(fallbackMessage, error);
  return errorResponse(fallbackCode, fallbackMessage, fallbackStatus);
}

export function publicAppOrigin(request: Request) {
  const configuredOrigin =
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_API_URL;
  try {
    const parsed = new URL(configuredOrigin || new URL(request.url).origin);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("Unsupported public URL scheme");
    }
    return parsed.origin;
  } catch {
    return new URL(request.url).origin;
  }
}
