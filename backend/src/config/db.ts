import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.includes("user:password@endpoint.neon.tech")) {
  console.warn(
    "\n⚠️  [Neon DB Warning] DATABASE_URL is not configured with a valid Neon connection string.\n" +
    "👉 Please set your Neon DB connection string in backend/.env:\n" +
    "   DATABASE_URL=\"postgresql://<user>:<password>@<endpoint>.neon.tech/<dbname>?sslmode=require\"\n"
  );
}

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});

/**
 * Checks connection to Neon DB and returns connection status.
 */
export async function checkDatabaseConnection(): Promise<{ ok: boolean; message: string }> {
  if (!databaseUrl || databaseUrl.includes("user:password@endpoint.neon.tech")) {
    return {
      ok: false,
      message: "DATABASE_URL is not set or still contains the placeholder. Please configure your Neon DB URL in backend/.env",
    };
  }

  try {
    // Ping database
    await prisma.$queryRaw`SELECT 1 as connected;`;
    return {
      ok: true,
      message: "Successfully connected to Neon DB Serverless PostgreSQL.",
    };
  } catch (error: any) {
    return {
      ok: false,
      message: `Failed to connect to Neon DB: ${error?.message || error}`,
    };
  }
}
