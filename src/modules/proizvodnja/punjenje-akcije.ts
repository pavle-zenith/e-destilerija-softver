"use server";

/**
 * Punjenje destilata:
 *  - u SUD (rinfuz): povećava trenutnu količinu suda i vezuje destilat za sud,
 *  - u BOCE (proizvod/SKU): evidentira broj napunjenih jedinica.
 * U oba slučaja upisuje ULAZ u `magacin_promet`. Sve u jednoj transakciji.
 */
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { punjenje, sudovi, magacinPromet } from "@/db/schema/magacin";
import { proizvodi } from "@/db/schema/sifarnici";
import { sr } from "@/i18n/sr";
import type { StanjeForme } from "@/modules/crud/tipovi";

export async function sacuvajPunjenje(
  _prethodno: StanjeForme,
  formData: FormData,
): Promise<StanjeForme> {
  const nacin = String(formData.get("nacin") ?? "sud");
  const destilatId = String(formData.get("destilatId") ?? "").trim();
  const datum = String(formData.get("datum") ?? "").trim() || null;
  const napomena = String(formData.get("napomena") ?? "").trim() || null;
  const sudId = String(formData.get("sudId") ?? "").trim();
  const proizvodId = String(formData.get("proizvodId") ?? "").trim();
  const kolicinaUnos = String(formData.get("kolicinaL") ?? "").replace(",", ".").trim();
  const brojJedinicaUnos = String(formData.get("brojJedinica") ?? "").trim();

  const greske: Record<string, string> = {};
  if (!destilatId) greske.destilatId = sr.forma.obavezno;

  if (nacin === "sud") {
    if (!sudId) greske.sudId = sr.forma.obavezno;
    if (!kolicinaUnos || Number.isNaN(Number(kolicinaUnos)) || Number(kolicinaUnos) <= 0)
      greske.kolicinaL = sr.forma.neispravanBroj;
  } else {
    if (!proizvodId) greske.proizvodId = sr.forma.obavezno;
    if (!brojJedinicaUnos || !Number.isInteger(Number(brojJedinicaUnos)) || Number(brojJedinicaUnos) <= 0)
      greske.brojJedinica = sr.forma.neispravanBroj;
  }
  if (Object.keys(greske).length) return { ok: false, greske };

  try {
    await db.transaction(async (tx) => {
      if (nacin === "sud") {
        const kolicinaL = Number(kolicinaUnos);
        const [p] = await tx
          .insert(punjenje)
          .values({ destilatId, sudId, kolicinaL: kolicinaL.toFixed(3), datum, napomena })
          .returning({ id: punjenje.id });

        const [sud] = await tx
          .select({ trenutna: sudovi.trenutnaKolicinaL })
          .from(sudovi)
          .where(eq(sudovi.id, sudId));
        const novaKolicina = (Number(sud?.trenutna ?? 0) + kolicinaL).toFixed(3);
        await tx
          .update(sudovi)
          .set({ trenutnaKolicinaL: novaKolicina, destilatId, updatedAt: new Date() })
          .where(eq(sudovi.id, sudId));

        await tx.insert(magacinPromet).values({
          sudId,
          tip: "ulaz",
          kolicina: kolicinaL.toFixed(3),
          referencaTip: "punjenje",
          referencaId: p.id,
          datum,
        });
      } else {
        const brojJedinica = Number(brojJedinicaUnos);
        const [proiz] = await tx
          .select({ zapreminaL: proizvodi.zapreminaL })
          .from(proizvodi)
          .where(eq(proizvodi.id, proizvodId));
        const ukupnoL = (brojJedinica * Number(proiz?.zapreminaL ?? 0)).toFixed(3);

        const [p] = await tx
          .insert(punjenje)
          .values({ destilatId, proizvodId, kolicinaL: ukupnoL, brojJedinica, datum, napomena })
          .returning({ id: punjenje.id });

        await tx.insert(magacinPromet).values({
          proizvodId,
          tip: "ulaz",
          kolicina: brojJedinica.toFixed(3),
          referencaTip: "punjenje",
          referencaId: p.id,
          datum,
        });
      }
    });
  } catch (e) {
    console.error("Greška pri punjenju", e);
    return { ok: false, poruka: sr.forma.greskaCuvanja };
  }

  revalidatePath("/proizvodnja/punjenje");
  revalidatePath("/proizvodnja/sudovi");
  revalidatePath("/magacin");
  return { ok: true };
}

/** Storno punjenja: briše punjenje, vraća magacin (briše ulaz) i umanjuje količinu suda. */
export async function stornirajPunjenje(id: string): Promise<void> {
  try {
    await db.transaction(async (tx) => {
      const [p] = await tx.select().from(punjenje).where(eq(punjenje.id, id));
      if (!p) return;
      if (p.sudId && p.kolicinaL) {
        const [s] = await tx
          .select({ k: sudovi.trenutnaKolicinaL })
          .from(sudovi)
          .where(eq(sudovi.id, p.sudId));
        const nova = Math.max(0, Number(s?.k ?? 0) - Number(p.kolicinaL)).toFixed(3);
        await tx.update(sudovi).set({ trenutnaKolicinaL: nova, updatedAt: new Date() }).where(eq(sudovi.id, p.sudId));
      }
      await tx
        .delete(magacinPromet)
        .where(and(eq(magacinPromet.referencaTip, "punjenje"), eq(magacinPromet.referencaId, id)));
      await tx.delete(punjenje).where(eq(punjenje.id, id));
    });
  } catch (e) {
    console.error("Greška pri storniranju punjenja", e);
    return;
  }
  revalidatePath("/proizvodnja/punjenje");
  revalidatePath("/proizvodnja/sudovi");
  revalidatePath("/magacin");
}
