import "server-only";

import { createHash } from "node:crypto";

export type PublicOrderAccess = {
  orderNumber: string;
  accessKey: string;
};

const MAX_SAVED_ORDERS = 20;

export function publicOrderCookieName(tableToken: string) {
  const suffix = createHash("sha256").update(tableToken).digest("hex").slice(0, 20);
  return `sb_order_${suffix}`;
}

export function encodePublicOrderAccess(accesses: PublicOrderAccess[]) {
  return Buffer.from(JSON.stringify(accesses.slice(0, MAX_SAVED_ORDERS))).toString("base64url");
}

export function decodePublicOrderAccess(value: string | undefined): PublicOrderAccess[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as unknown;
    // Accept the original single-order cookie format so existing customers keep access.
    const entries = Array.isArray(parsed) ? parsed : [parsed];
    const valid = entries.filter((entry): entry is PublicOrderAccess => {
      if (typeof entry !== "object" || entry === null) return false;
      const candidate = entry as Partial<PublicOrderAccess>;
      return typeof candidate.orderNumber === "string" &&
        typeof candidate.accessKey === "string" &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate.accessKey);
    });
    return valid.slice(0, MAX_SAVED_ORDERS);
  } catch {
    return [];
  }
}

export function readRequestCookie(request: Request, name: string) {
  const prefix = `${name}=`;
  const entry = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : undefined;
}
