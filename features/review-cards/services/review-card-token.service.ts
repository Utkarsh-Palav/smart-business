import { randomBytes } from "node:crypto";

export function generateReviewCardToken(): string {
  return randomBytes(8).toString("base64url");
}