import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set to the Supabase Postgres connection string");
}

// Singleton Pool to avoid too many connections in dev
const globalForPg = globalThis as unknown as { __pgPool?: Pool };
export const pool =
  globalForPg.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // If sslmode is not in the URL, uncomment the next line:
    // ssl: { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") globalForPg.__pgPool = pool;

export const db = drizzle(pool, { schema });

// Optional: quick version check
export async function getDBVersion() {
  const res = await pool.query("SELECT version()");
  return { version: res.rows?.[0]?.version as string };
}
