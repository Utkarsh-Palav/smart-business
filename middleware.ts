import { NextRequest, NextResponse } from "next/server";

import {
  ACCESS_COOKIE_NAME,
  getAccessCookieOptions,
  verifyAccessToken,
} from "./lib/auth/session/session";

const PROTECTED_ROUTES = ["/dashboard"];
const AUTH_ROUTES = ["/login", "/register"];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((route) =>
    matchesRoute(pathname, route),
  );
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    matchesRoute(pathname, route),
  );
  let hasValidAccessToken = false;

  if (token) {
    try {
      await verifyAccessToken(token);
      hasValidAccessToken = true;
    } catch {
      hasValidAccessToken = false;
    }
  }

  if (isProtected && !hasValidAccessToken) {
    const loginURL = new URL("/login", request.url);
    loginURL.searchParams.set(
      "callbackUrl",
      `${pathname}${request.nextUrl.search}`,
    );
    const response = NextResponse.redirect(loginURL);

    if (token) {
      response.cookies.set(ACCESS_COOKIE_NAME, "", {
        ...getAccessCookieOptions(),
        maxAge: 0,
      });
    }

    return response;
  }

  if (isAuthRoute && hasValidAccessToken) {
    const dashboardURL = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
