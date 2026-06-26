"use server";

/**
 * Server akcije za šifarnike: čuvanje (kreiranje/izmena) i brisanje.
 * Generičke — rade za bilo koji resurs preko ključa i registra tabela.
 *
 * Bezbednost: jedan nalog (Faza 0/1). Autentikacija će se dodati kada se
 * uvede prijava — tada ovde ide provera sesije (vidi Next docs: Data Security).
 */
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  RESURSI,
  jeResursKljuc,
  zodZaResurs,
  type ResursKljuc,
  type StanjeForme,
} from "./polja";
import { TABELE } from "./registar";

/** Sklapa sirov objekat iz FormData prema poljima resursa. */
function sirovoIzForme(kljuc: ResursKljuc, formData: FormData) {
  const sirovo: Record<string, FormDataEntryValue | null> = {};
  for (const polje of RESURSI[kljuc].polja) {
    sirovo[polje.ime] = formData.get(polje.ime);
  }
  return sirovo;
}

export async function sacuvaj(
  kljuc: ResursKljuc,
  _prethodno: StanjeForme,
  formData: FormData,
): Promise<StanjeForme> {
  if (!jeResursKljuc(kljuc)) return { ok: false, poruka: "Nepoznat resurs" };

  const sema = zodZaResurs(RESURSI[kljuc]);
  const rezultat = sema.safeParse(sirovoIzForme(kljuc, formData));

  if (!rezultat.success) {
    const greske: Record<string, string> = {};
    for (const [polje, poruke] of Object.entries(
      rezultat.error.flatten().fieldErrors,
    )) {
      if (poruke && poruke[0]) greske[polje] = poruke[0];
    }
    return { ok: false, greske };
  }

  const tabela = TABELE[kljuc];
  const vrednosti = rezultat.data as Record<string, unknown>;
  const id = (formData.get("id") as string | null) || null;

  try {
    if (id) {
      await db
        .update(tabela)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .set({ ...vrednosti, updatedAt: new Date() } as any)
        .where(eq(tabela.id, id));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.insert(tabela).values(vrednosti as any);
    }
  } catch (e) {
    console.error("Greška pri čuvanju šifarnika", kljuc, e);
    return { ok: false, poruka: "Greška pri čuvanju. Pokušajte ponovo." };
  }

  revalidatePath(`/sifarnici/${kljuc}`);
  return { ok: true };
}

export async function obrisi(kljuc: ResursKljuc, id: string): Promise<StanjeForme> {
  if (!jeResursKljuc(kljuc)) return { ok: false, poruka: "Nepoznat resurs" };

  try {
    const tabela = TABELE[kljuc];
    await db.delete(tabela).where(eq(tabela.id, id));
  } catch (e) {
    console.error("Greška pri brisanju šifarnika", kljuc, e);
    return { ok: false, poruka: "Brisanje nije uspelo (stavka je možda u upotrebi)." };
  }

  revalidatePath(`/sifarnici/${kljuc}`);
  return { ok: true };
}
