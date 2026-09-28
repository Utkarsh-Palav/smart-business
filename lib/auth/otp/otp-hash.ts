import { createHash, timingSafeEqual } from "crypto";
import "server-only";

export function hashOtp(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export function verifyOtp(code: string, expectedHash: string): boolean {
  const actualHash = Buffer.from(hashOtp(code), "hex");

  const storedHash = Buffer.from(expectedHash, "hex");

  if (actualHash.length !== storedHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, storedHash);
}
