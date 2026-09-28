import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "./control",
  migrations: {
    path: "./control/migrations",
  },
  datasource: {
    url: process.env["CONTROL_DATABASE_URL"],
  },
});
