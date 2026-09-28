import { PrismaClient } from "@/generated/control/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "server-only";

const databaseUrl = process.env.CONTROL_DATABASE_URL;

if (!databaseUrl) {
  throw new Error("CONTROL_DATABASE_URL is not configured");
}

const adapter = new PrismaPg(databaseUrl);

const globalForControlPrisma = globalThis as unknown as {
  controlPrisma: PrismaClient | undefined;
};

export const controlPrisma =
  globalForControlPrisma.controlPrisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForControlPrisma.controlPrisma = controlPrisma;
}
