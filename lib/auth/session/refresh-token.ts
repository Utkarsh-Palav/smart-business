import { createHash, randomBytes } from "crypto";
import "server-only";

const REFRESH_TOKEN_BYTES = 48;

export function generateRefreshToken(): string {
  return randomBytes(REFRESH_TOKEN_BYTES).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  if (!token) throw new Error("Refresh token is requried");

  return createHash("sha256").update(token, "utf8").digest("hex");
}
