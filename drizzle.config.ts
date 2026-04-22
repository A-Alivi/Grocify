 import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./lib/server/db/schema.tsx",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEON_DATABASE_URL ?? "",
  },
});