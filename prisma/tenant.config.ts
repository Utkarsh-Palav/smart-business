import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./tenant",
  migrations: {
    path: "./tenant/migrations",
  },
  datasource: {
    url: process.env["TENANT_DATABASE_URL"],
  },
});