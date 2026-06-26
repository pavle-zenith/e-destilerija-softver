"use server";

/**
 * Generičke CRUD akcije za sve entitete (šifarnici + proizvodnja).
 * Rade preko ključa entiteta i registra tabela.
 *
 * Bezbednost: jedan nalog. Autentikacija će se dodati uz prijavu
 * (vidi Next docs: Data Security) — tada ovde ide provera sesije.
 */
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { ENTITETI, jeEntitetKljuc } from "./entiteti";
import { zodZaEntitet, type StanjeForme } from "./tipovi";
import { TABELE, IZRACUNAJ } from "./registar";

function sirovoIzForme(kljuc: string, formData: FormData) {
  const sirovo: Record<string, FormDataEntryValue | null> = {};
  for (const polje of ENTITETI[kljuc].polja) {
    sirovo[polje.ime] = formData.get(polje.ime);
  }
  return sirovo;
}

export async function sacuvaj(
  kljuc: string,
  _prethodno: StanjeForme,
  formData: FormData,
): Promise<StanjeForme> {
  if (!jeEntitetKljuc(kljuc)) return { ok: false, poruka: "Nepoznat entitet" };
  const meta = ENTITETI[kljuc];

  const rezultat = zodZaEntitet(meta).safeParse(sirovoIzForme(kljuc, formData));
  if (!rezultat.success) {
    const greske: Record<string, string> = {};
    for (const [polje, poruke] of Object.entries(rezultat.error.flatten().fieldErrors)) {
      if (poruke && poruke[0]) greske[polje] = poruke[0];
    }
    return { ok: false, greske };
  }

  const tabela = TABELE[kljuc];
  const id = (formData.get("id") as string | null) || null;
  const vrednosti = rezultat.data as Record<string, unknown>;
  // Izračunata polja (npr. cist alkohol, QR kod) — spajaju se sa unetim.
  const izracunata = IZRACUNAJ[kljuc]?.(vrednosti, !id) ?? {};
  const zaUpis = { ...vrednosti, ...izracunata };

  try {
    if (id) {
      await db
        .update(tabela)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .set({ ...zaUpis, updatedAt: new Date() } as any)
        .where(eq(tabela.id, id));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await db.insert(tabela).values(zaUpis as any);
    }
  } catch (e) {
    console.error("Greška pri čuvanju entiteta", kljuc, e);
    return { ok: false, poruka: "Greška pri čuvanju. Pokušajte ponovo." };
  }

  revalidatePath(`${meta.osnovnaPutanja}/${kljuc}`);
  return { ok: true };
}

export async function obrisi(kljuc: string, id: string): Promise<StanjeForme> {
  if (!jeEntitetKljuc(kljuc)) return { ok: false, poruka: "Nepoznat entitet" };
  const meta = ENTITETI[kljuc];

  try {
    const tabela = TABELE[kljuc];
    await db.delete(tabela).where(eq(tabela.id, id));
  } catch (e) {
    console.error("Greška pri brisanju entiteta", kljuc, e);
    return { ok: false, poruka: "Brisanje nije uspelo (stavka je možda u upotrebi)." };
  }

  revalidatePath(`${meta.osnovnaPutanja}/${kljuc}`);
  return { ok: true };
}
