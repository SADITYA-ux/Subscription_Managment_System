import { defineConfig } from "drizzle-kit";
import "dotenv/config"

console.log(process.env.DATABASE_URL!, "drizzle config");
export default defineConfig({
  dialect: "postgresql", // 'mysql' | 'sqlite' | 'turso'
  schema: "./src/db/schema.ts",
    out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

});