import "server-only";

import { createHash } from "node:crypto";

export type PublicOrderAccess = {
  orderNumber: string;
  accessKey: string;
};

export function publicOrderCookieName(tableToken: string) {
  const suffix = createHash("sha256").update(tableToken).digest("hex").slice(0, 20);
  return `sb_order_${suffix}`;
}

export function encodePublicOrderAccess(access: PublicOrderAccess) {
  return Buffer.from(JSON.stringify(access)).toString("base64url");
}

export function decodePublicOrderAccess(value: string | undefined): PublicOrderAccess | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as Partial<PublicOrderAccess>;
    if (
      typeof parsed.orderNumber !== "string" ||
      typeof parsed.accessKey !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(parsed.accessKey)
    ) return null;
    return { orderNumber: parsed.orderNumber, accessKey: parsed.accessKey };
  } catch {
    return null;
  }
}

export function readRequestCookie(request: Request, name: string) {
  const prefix = `${name}=`;
  const entry = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : undefined;
}
