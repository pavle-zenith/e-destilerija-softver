"use server";

/**
 * Egalizacija — mešanje više ulaznih destilata u jedan novi (rezultujući) destilat.
 * U transakciji: izračuna ukupnu količinu i ponderisanu jačinu, kreira novi destilat,
 * upiše događaj egalizacije i sve ulaze.
 */
import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { destilati, egalizacija, egalizacijaUlazi } from "@/db/schema/proizvodnja";
import { sr } from "@/i18n/sr";
import type { StanjeForme } from "@/modules/crud/tipovi";

export async function sacuvajEgalizaciju(
  _prethodno: StanjeForme,
  formData: FormData,
): Promise<StanjeForme> {
  const oznaka = String(formData.get("oznaka") ?? "").trim();
  const datum = String(formData.get("datum") ?? "").trim() || null;
  const napomena = String(formData.get("napomena") ?? "").trim() || null;
  const vrstaRakijeId = String(formData.get("vrstaRakijeId") ?? "").trim() || null;

  // Paralelni nizovi iz dinamičkih redova forme.
  const destIds = formData.getAll("ulazDestilatId").map((v) => String(v));
  const kolicine = formData.getAll("ulazKolicinaL").map((v) => String(v));
  const ulazi: { destilatId: string; kolicinaL: string }[] = [];
  for (let i = 0; i < destIds.length; i++) {
    const d = destIds[i]?.trim();
    const k = (kolicine[i] ?? "").replace(",", ".").trim();
    if (d && k && !Number.isNaN(Number(k)) && Number(k) > 0) {
      ulazi.push({ destilatId: d, kolicinaL: k });
    }
  }

  const greske: Record<string, string> = {};
  if (!oznaka) greske.oznaka = sr.forma.obavezno;
  if (ulazi.length === 0) greske.ulazi = sr.egalizacija.bezUlaza;
  if (Object.keys(greske).length) return { ok: false, greske };

  try {
    await db.transaction(async (tx) => {
      const ids = ulazi.map((u) => u.destilatId);
      const redovi = await tx
        .select({ id: destilati.id, jacina: destilati.jacina })
        .from(destilati)
        .where(inArray(destilati.id, ids));
      const jacinaPoId = new Map(redovi.map((r) => [r.id, Number(r.jacina)]));

      let ukupnoL = 0;
      let ukupnoCist = 0;
      for (const u of ulazi) {
        const L = Number(u.kolicinaL);
        const j = jacinaPoId.get(u.destilatId) ?? 0;
        ukupnoL += L;
        ukupnoCist += (L * j) / 100;
      }
      const jacinaRez = ukupnoL > 0 ? (ukupnoCist / ukupnoL) * 100 : 0;

      const [rez] = await tx
        .insert(destilati)
        .values({
          oznaka,
          vrstaRakijeId,
          kolicinaL: ukupnoL.toFixed(3),
          jacina: jacinaRez.toFixed(2),
          cistAlkoholL: ukupnoCist.toFixed(3),
          datum,
          napomena: sr.egalizacija.naslov,
        })
        .returning({ id: destilati.id });

      const [eg] = await tx
        .insert(egalizacija)
        .values({ oznaka, rezultatDestilatId: rez.id, datum, napomena })
        .returning({ id: egalizacija.id });

      await tx.insert(egalizacijaUlazi).values(
        ulazi.map((u) => ({ egalizacijaId: eg.id, destilatId: u.destilatId, kolicinaL: u.kolicinaL })),
      );
    });
  } catch (e) {
    console.error("Greška pri egalizaciji", e);
    return { ok: false, poruka: sr.forma.greskaCuvanja };
  }

  revalidatePath("/proizvodnja/egalizacija");
  revalidatePath("/proizvodnja/destilati");
  return { ok: true };
}
