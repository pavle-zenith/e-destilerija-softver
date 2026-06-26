import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// `DATABASE_URL` je naša konvencija (.env.local); `POSTGRES_URL` postavlja
// Supabase↔Vercel integracija u produkciji. Prihvatamo oba.
const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL (ili POSTGRES_URL) nije postavljen. Kopirajte .env.example u .env.local i unesite Supabase konekcioni string.",
  );
}

// Jedna instanca konekcije po procesu (izbegava previše konekcija u dev hot-reload-u).
const globalForDb = globalThis as unknown as {
  client?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.client ?? postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== "production") {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
export { schema };
