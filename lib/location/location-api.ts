import { NextResponse } from "next/server";
import { LocationManagementError } from "./location-management.service";

export function locationApiError(error: unknown, fallbackCode: string, fallbackMessage: string) {
  if (error instanceof LocationManagementError) {
    return NextResponse.json(
      { success: false, error: { code: error.code, message: error.message } },
      { status: error.status },
    );
  }
  console.error(fallbackMessage, error);
  return NextResponse.json(
    { success: false, error: { code: fallbackCode, message: fallbackMessage } },
    { status: 500 },
  );
}

export function validationError(message: string, details: unknown) {
  return NextResponse.json(
    { success: false, error: { code: "VALIDATION_ERROR", message, details } },
    { status: 400 },
  );
}

export function unauthorizedError() {
  return NextResponse.json(
    { success: false, error: { code: "UNAUTHORIZED", message: "Authentication is required." } },
    { status: 401 },
  );
}

export function publicAppOrigin(request: Request) {
  const configuredOrigin = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_API_URL;
  try {
    const parsed = new URL(configuredOrigin || new URL(request.url).origin);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") throw new Error("Unsupported public URL scheme");
    return parsed.origin;
  } catch {
    return new URL(request.url).origin;
  }
}
