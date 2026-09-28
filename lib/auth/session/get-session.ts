import "server-only";

import { cookies } from "next/headers";

import { ACCESS_COOKIE_NAME, verifyAccessToken } from "./session";

export async function getAuthSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get(ACCESS_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}
