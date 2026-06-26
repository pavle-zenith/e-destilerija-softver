"use server";

/**
 * Unos prodaje (izlazni račun). U transakciji:
 *  - upiše račun (prodaja) + stavke (sa lotom i vezom na destilat),
 *  - za svaku stavku snima snapshot zapremine/jačine i računa čist alkohol,
 *  - upiše IZLAZ u magacin_promet (umanjuje zalihe),
 *  - sračuna ukupan iznos i procenjenu akcizu po stopi važećoj na datum.
 */
import { desc, eq, inArray, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { prodaja, prodajaStavke } from "@/db/schema/prodaja";
import { magacinPromet } from "@/db/schema/magacin";
import { proizvodi, akcizaStopa } from "@/db/schema/sifarnici";
import { destilati } from "@/db/schema/proizvodnja";
import { cistAlkoholL, obracunajAkcizu } from "@/lib/akciza";
import { sr } from "@/i18n/sr";
import type { StanjeForme } from "@/modules/crud/tipovi";

export async function sacuvajProdaju(
  _prethodno: StanjeForme,
  formData: FormData,
): Promise<StanjeForme> {
  const broj = String(formData.get("broj") ?? "").trim() || null;
  const kupacId = String(formData.get("kupacId") ?? "").trim() || null;
  const datum = String(formData.get("datum") ?? "").trim();
  const napomena = String(formData.get("napomena") ?? "").trim() || null;

  const proizvodIds = formData.getAll("stavkaProizvodId").map(String);
  const destilatIds = formData.getAll("stavkaDestilatId").map(String);
  const boce = formData.getAll("stavkaBoca").map(String);
  const cene = formData.getAll("stavkaCena").map(String);

  type Unos = { proizvodId: string; destilatId: string | null; kolicina: number; cena: number | null };
  const stavke: Unos[] = [];
  for (let i = 0; i < proizvodIds.length; i++) {
    const pid = proizvodIds[i]?.trim();
    const k = Number((boce[i] ?? "").replace(",", "."));
    if (pid && !Number.isNaN(k) && k > 0) {
      const c = Number((cene[i] ?? "").replace(",", "."));
      stavke.push({
        proizvodId: pid,
        destilatId: destilatIds[i]?.trim() || null,
        kolicina: k,
        cena: !Number.isNaN(c) && c > 0 ? c : null,
      });
    }
  }

  const greske: Record<string, string> = {};
  if (!datum) greske.datum = sr.forma.obavezno;
  if (stavke.length === 0) greske.stavke = sr.prodajaUI.bezStavki;
  if (Object.keys(greske).length) return { ok: false, greske };

  try {
    await db.transaction(async (tx) => {
      // Snapshot podataka o proizvodima i lotovima (destilatima).
      const pIds = [...new Set(stavke.map((s) => s.proizvodId))];
      const dIds = [...new Set(stavke.map((s) => s.destilatId).filter(Boolean) as string[])];
      const proizvodiRed = await tx
        .select({ id: proizvodi.id, zapreminaL: proizvodi.zapreminaL, jacina: proizvodi.jacina })
        .from(proizvodi)
        .where(inArray(proizvodi.id, pIds));
      const proizvodMap = new Map(proizvodiRed.map((p) => [p.id, p]));
      const destMap = new Map<string, { oznaka: string; jacina: string }>();
      if (dIds.length) {
        const dRed = await tx
          .select({ id: destilati.id, oznaka: destilati.oznaka, jacina: destilati.jacina })
          .from(destilati)
          .where(inArray(destilati.id, dIds));
        for (const d of dRed) destMap.set(d.id, { oznaka: d.oznaka, jacina: d.jacina });
      }

      // Važeća akcizna stopa na datum prodaje.
      const [stopaRed] = await tx
        .select({ stopa: akcizaStopa.rsdPoLitruCistogAlkohola })
        .from(akcizaStopa)
        .where(lte(akcizaStopa.vaziOd, datum))
        .orderBy(desc(akcizaStopa.vaziOd))
        .limit(1);
      const stopa = Number(stopaRed?.stopa ?? 0);

      let ukupnoIznos = 0;
      let ukupnoAkciza = 0;
      const stavkeZaUpis: (typeof prodajaStavke.$inferInsert)[] = [];
      const prometZaUpis: (typeof magacinPromet.$inferInsert)[] = [];

      const [racun] = await tx
        .insert(prodaja)
        .values({ broj, kupacId, datum, napomena })
        .returning({ id: prodaja.id });

      for (const s of stavke) {
        const p = proizvodMap.get(s.proizvodId);
        if (!p) continue;
        const dest = s.destilatId ? destMap.get(s.destilatId) : undefined;
        const zapreminaL = Number(p.zapreminaL);
        // Jačina lota (destilata) je merodavnija; ako nema lota, koristi nominalnu jačinu proizvoda.
        const jacina = dest ? Number(dest.jacina) : Number(p.jacina);
        const cist = cistAlkoholL(s.kolicina * zapreminaL, jacina);
        const akcizaStavke = obracunajAkcizu(cist, stopa);
        ukupnoAkciza += akcizaStavke;
        if (s.cena != null) ukupnoIznos += s.kolicina * s.cena;

        stavkeZaUpis.push({
          prodajaId: racun.id,
          proizvodId: s.proizvodId,
          lot: dest?.oznaka ?? null,
          destilatId: s.destilatId,
          kolicina: s.kolicina.toFixed(3),
          zapreminaL: zapreminaL.toFixed(3),
          jacina: jacina.toFixed(2),
          cistAlkoholL: cist.toFixed(3),
          cenaJedinice: s.cena != null ? s.cena.toFixed(2) : null,
        });
        prometZaUpis.push({
          proizvodId: s.proizvodId,
          tip: "izlaz",
          kolicina: s.kolicina.toFixed(3),
          referencaTip: "prodaja",
          referencaId: racun.id,
          datum,
        });
      }

      await tx.insert(prodajaStavke).values(stavkeZaUpis);
      await tx.insert(magacinPromet).values(prometZaUpis);
      await tx
        .update(prodaja)
        .set({
          ukupnoBezAkcize: ukupnoIznos.toFixed(2),
          ukupnoAkciza: ukupnoAkciza.toFixed(2),
          updatedAt: new Date(),
        })
        .where(eq(prodaja.id, racun.id));
    });
  } catch (e) {
    console.error("Greška pri unosu prodaje", e);
    return { ok: false, poruka: sr.forma.greskaCuvanja };
  }

  revalidatePath("/prodaja");
  revalidatePath("/magacin");
  revalidatePath("/akcize");
  return { ok: true };
}
