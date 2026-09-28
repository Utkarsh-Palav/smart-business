import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import "server-only";
import { promisify } from "util";

const scrypt = promisify(scryptCallback);

const SALT_BYTE = 16;
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  validatePasswordInput(password);

  const salt = randomBytes(SALT_BYTE);

  const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

  return `${salt.toString("base64url")}:${derivedKey.toString("base64url")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  if (!password || !storedHash) return false;

  const [saltEncoded, hashEncoded] = storedHash.split(":");

  if (!saltEncoded || !hashEncoded) return false;

  try {
    const salt = Buffer.from(saltEncoded, "base64url");
    const expectedHash = Buffer.from(hashEncoded, "base64url");

    const derivedKey = (await scrypt(
      password,
      salt,
      expectedHash.length,
    )) as Buffer;

    if (derivedKey.length !== expectedHash.length) {
      return false;
    }

    return timingSafeEqual(derivedKey, expectedHash);
  } catch (error) {
    return false;
  }
}

function validatePasswordInput(password: string): void {
  if (!password) throw new Error("Password is required");

  if (password.length < 8)
    throw new Error("Password must be atleast 8 characters long");

  if (password.length > 128)
    throw new Error("Password must not excet 128 characters");
}
