import "server-only";

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const ACCESS_COOKIE_NAME = "smart_business_access";
const REFRESH_COOKIE_NAME = "smart_business_refresh";

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 30 * 24 * 60 * 60;

const JWT_ISSUER = "smart-business";
const JWT_AUDIENCE = "smart-business-web";

function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET;

  if (!secret) {
    throw new Error("AUTH_JWT_SECRET is not configured");
  }

  if (secret.length < 32) {
    throw new Error("AUTH_JWT_SECRET must be at least 32 characters long");
  }

  return new TextEncoder().encode(secret);
}

export type AuthAccessTokenPayload = {
  userId: string;
  sessionId: string;
};

type AuthJwtPayload = JWTPayload & {
  userId?: string;
  sessionId?: string;
};

export async function createAccessToken(
  input: AuthAccessTokenPayload,
): Promise<string> {
  if (!input.userId) {
    throw new Error("userId is required to create an access token");
  }

  if (!input.sessionId) {
    throw new Error("sessionId is required to create an access token");
  }

  const secret = getJwtSecret();

  return new SignJWT({
    userId: input.userId,
    sessionId: input.sessionId,
  })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(input.userId)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(secret);
}

export async function verifyAccessToken(
  token: string,
): Promise<AuthAccessTokenPayload> {
  if (!token) {
    throw new Error("Authentication token is required");
  }

  const secret = getJwtSecret();

  const { payload } = await jwtVerify<AuthJwtPayload>(token, secret, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    algorithms: ["HS256"],
  });

  if (typeof payload.userId !== "string" || !payload.userId) {
    throw new Error("Authentication token does not contain a valid user ID");
  }

  if (typeof payload.sessionId !== "string" || !payload.sessionId) {
    throw new Error("Authentication token does not contain a valid session ID");
  }

  return {
    userId: payload.userId,
    sessionId: payload.sessionId,
  };
}

export function getAccessCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
  };
}

export function getRefreshCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/auth",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
  };
}

export {
  ACCESS_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
};
