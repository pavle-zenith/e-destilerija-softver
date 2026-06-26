/**
 * Početni podaci (test/demo). Pokreni sa `npm run db:seed` (zahteva DATABASE_URL).
 * Dopunjavaće se kako moduli budu rasli.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { podesavanja, akcizaStopa, vrsteRakije } from "./schema";

async function seed() {
  // Singleton podešavanja
  await db
    .insert(podesavanja)
    .values({ id: 1, nazivFirme: "Moja destilerija", akcizaRokDana: 15, podsetnikDana: 3 })
    .onConflictDoNothing();

  // Važeća akcizna stopa (primer za 2025 — proveri aktuelnu vrednost kod Uprave carina).
  await db
    .insert(akcizaStopa)
    .values({ rsdPoLitruCistogAlkohola: "575.7084", vaziOd: "2025-01-01", napomena: "Primer — zameni aktuelnom stopom" })
    .onConflictDoNothing();

  // Osnovne vrste rakije
  await db
    .insert(vrsteRakije)
    .values([
      { naziv: "Šljivovica" },
      { naziv: "Kajsijevača" },
      { naziv: "Lozovača" },
      { naziv: "Viljamovka" },
    ])
    .onConflictDoNothing();

  console.log("Seed završen.");
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
