"use server";

/**
 * Akcizne akcije: obračun perioda (upsert u akciza_obracun) i označavanje plaćanja.
 */
import { and, desc, gte, lte, sql } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { akcizaObracun } from "@/db/schema/akcize";
import { akcizaStopa, podesavanja } from "@/db/schema/sifarnici";
import { prodaja, prodajaStavke } from "@/db/schema/prodaja";
import { granicePerioda, obracunajAkcizu, rokPlacanja } from "@/lib/akciza";

const iso = (d: Date) => d.toISOString().slice(0, 10);

// Koriste se kao form `action` (povratni tip void).
export async function obracunajPeriod(godina: number, mesec: number, deo: 1 | 2): Promise<void> {
  try {
    const per = granicePerioda(godina, mesec, deo);
    const odIso = iso(per.od);
    const doIso = iso(per.do);

    // Zbir čistog alkohola iz prodaje u periodu.
    const [zbir] = await db
      .select({ litara: sql<string>`coalesce(sum(${prodajaStavke.cistAlkoholL}), 0)` })
      .from(prodajaStavke)
      .innerJoin(prodaja, eq(prodaja.id, prodajaStavke.prodajaId))
      .where(and(gte(prodaja.datum, odIso), lte(prodaja.datum, doIso)));
    const litara = Number(zbir?.litara ?? 0);

    // Važeća stopa i rok.
    const [stopaRed] = await db
      .select({ stopa: akcizaStopa.rsdPoLitruCistogAlkohola })
      .from(akcizaStopa)
      .where(lte(akcizaStopa.vaziOd, doIso))
      .orderBy(desc(akcizaStopa.vaziOd))
      .limit(1);
    const stopa = Number(stopaRed?.stopa ?? 0);
    const iznos = obracunajAkcizu(litara, stopa);
    const [pod] = await db.select().from(podesavanja).limit(1);
    const rok = iso(rokPlacanja(per.do, pod?.akcizaRokDana ?? 15));

    await db
      .insert(akcizaObracun)
      .values({
        godina,
        mesec,
        deo,
        periodOd: odIso,
        periodDo: doIso,
        litaraCistogAlkohola: litara.toFixed(3),
        stopa: stopa.toFixed(4),
        iznos: iznos.toFixed(2),
        rok,
      })
      .onConflictDoUpdate({
        target: [akcizaObracun.godina, akcizaObracun.mesec, akcizaObracun.deo],
        // status se NE dira — sačuva 'placeno' ako je već plaćeno.
        set: {
          periodOd: odIso,
          periodDo: doIso,
          litaraCistogAlkohola: litara.toFixed(3),
          stopa: stopa.toFixed(4),
          iznos: iznos.toFixed(2),
          rok,
          updatedAt: new Date(),
        },
      });
  } catch (e) {
    console.error("Greška pri obračunu akcize", e);
    return;
  }
  revalidatePath("/akcize");
}

export async function oznaciPlaceno(id: string): Promise<void> {
  try {
    await db
      .update(akcizaObracun)
      .set({ status: "placeno", datumPlacanja: iso(new Date()), updatedAt: new Date() })
      .where(eq(akcizaObracun.id, id));
  } catch (e) {
    console.error("Greška pri označavanju plaćanja", e);
    return;
  }
  revalidatePath("/akcize");
}
