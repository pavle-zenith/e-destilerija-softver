"use server";

/**
 * Čuvanje globalnih podešavanja (singleton red, id = 1).
 * Upsert: prvi put kreira red, kasnije ga ažurira.
 */
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { podesavanja } from "@/db/schema";
import { sr } from "@/i18n/sr";
import type { StanjeForme } from "@/modules/crud/tipovi";

const prazanUNull = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? null : v;

const sema = z.object({
  nazivFirme: z.preprocess(prazanUNull, z.string().trim().nullable()),
  pib: z.preprocess(prazanUNull, z.string().trim().nullable()),
  maticniBroj: z.preprocess(prazanUNull, z.string().trim().nullable()),
  adresa: z.preprocess(prazanUNull, z.string().trim().nullable()),
  akcizaRokDana: z.coerce.number({ message: sr.forma.neispravanBroj }).int().min(0),
  podsetnikDana: z.coerce.number({ message: sr.forma.neispravanBroj }).int().min(0),
});

export async function sacuvajPodesavanja(
  _prethodno: StanjeForme,
  formData: FormData,
): Promise<StanjeForme> {
  const rezultat = sema.safeParse({
    nazivFirme: formData.get("nazivFirme"),
    pib: formData.get("pib"),
    maticniBroj: formData.get("maticniBroj"),
    adresa: formData.get("adresa"),
    akcizaRokDana: formData.get("akcizaRokDana"),
    podsetnikDana: formData.get("podsetnikDana"),
  });

  if (!rezultat.success) {
    const greske: Record<string, string> = {};
    for (const [polje, poruke] of Object.entries(rezultat.error.flatten().fieldErrors)) {
      if (poruke && poruke[0]) greske[polje] = poruke[0];
    }
    return { ok: false, greske };
  }

  try {
    await db
      .insert(podesavanja)
      .values({ id: 1, ...rezultat.data })
      .onConflictDoUpdate({
        target: podesavanja.id,
        set: { ...rezultat.data, updatedAt: new Date() },
      });
  } catch (e) {
    console.error("Greška pri čuvanju podešavanja", e);
    return { ok: false, poruka: sr.forma.greskaCuvanja };
  }

  revalidatePath("/podesavanja");
  return { ok: true, poruka: sr.stanje.sacuvano };
}
