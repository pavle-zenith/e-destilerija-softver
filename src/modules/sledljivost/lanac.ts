/**
 * Sklapanje lanca sledljivosti:
 *   sirovina → partija → destilat → (egalizacija) → punjenje → sud → prodaja
 * Polazi se ili od suda (QR kod) ili od lota (oznaka destilata).
 */
import "server-only";
import { desc, eq, or } from "drizzle-orm";
import { db } from "@/db";
import { destilati, proizvodnePartije, sirovine, egalizacija, egalizacijaUlazi } from "@/db/schema/proizvodnja";
import { sudovi, punjenje } from "@/db/schema/magacin";
import { dobavljaci, vrsteRakije, kupci } from "@/db/schema/sifarnici";
import { prodaja, prodajaStavke } from "@/db/schema/prodaja";
import { sastaviLanac, type KorakLanca, type Lanac } from "@/lib/sledljivost";
import { sr } from "@/i18n/sr";
import { litara, procenat, broj, datum as fmtDatum } from "@/i18n/format";

type DestilatRed = typeof destilati.$inferSelect;

/** Koraci porekla destilata: egalizacija (sa ulazima) ili partija → sirovina. */
async function koraciPorekla(d: DestilatRed): Promise<KorakLanca[]> {
  const koraci: KorakLanca[] = [];
  const [eg] = await db.select().from(egalizacija).where(eq(egalizacija.rezultatDestilatId, d.id));

  if (eg) {
    const ulazi = await db
      .select({ oznaka: destilati.oznaka, jacina: destilati.jacina, kolicinaL: egalizacijaUlazi.kolicinaL })
      .from(egalizacijaUlazi)
      .leftJoin(destilati, eq(destilati.id, egalizacijaUlazi.destilatId))
      .where(eq(egalizacijaUlazi.egalizacijaId, eg.id));
    koraci.push({
      tip: "egalizacija",
      naslov: `${sr.koraci.egalizacija}: ${eg.oznaka}`,
      datum: eg.datum,
      referencaId: eg.id,
      detalji: ulazi.map((u) => `${u.oznaka ?? "—"} — ${litara(u.kolicinaL)} (${procenat(u.jacina)})`),
    });
    return koraci;
  }

  if (d.partijaId) {
    const [partija] = await db.select().from(proizvodnePartije).where(eq(proizvodnePartije.id, d.partijaId));
    if (partija) {
      if (partija.sirovinaId) {
        const [sir] = await db
          .select({
            naziv: sirovine.naziv,
            kolicinaKg: sirovine.kolicinaKg,
            datumPrijema: sirovine.datumPrijema,
            dobavljac: dobavljaci.naziv,
          })
          .from(sirovine)
          .leftJoin(dobavljaci, eq(dobavljaci.id, sirovine.dobavljacId))
          .where(eq(sirovine.id, partija.sirovinaId));
        if (sir) {
          koraci.push({
            tip: "sirovina",
            naslov: `${sr.koraci.sirovina}: ${sir.naziv}`,
            datum: sir.datumPrijema,
            detalji: [
              sir.dobavljac ? `${sr.polja.dobavljac}: ${sir.dobavljac}` : "",
              sir.kolicinaKg ? `${sr.polja.kolicinaKg}: ${broj(sir.kolicinaKg)}` : "",
            ].filter(Boolean),
          });
        }
      }
      koraci.push({
        tip: "partija",
        naslov: `${sr.koraci.partija}: ${partija.oznaka}`,
        datum: partija.datumPocetka,
        referencaId: partija.id,
        detalji: [
          partija.prinosL ? `${sr.polja.prinosL}: ${litara(partija.prinosL)}` : "",
          partija.jacina ? `${sr.polja.jacina}: ${procenat(partija.jacina)}` : "",
        ].filter(Boolean),
      });
    }
  }
  return koraci;
}

/** Korak samog destilata (sa vrstom rakije). */
async function korakDestilata(d: DestilatRed): Promise<KorakLanca> {
  let vrsta: string | null = null;
  if (d.vrstaRakijeId) {
    const [vr] = await db.select({ naziv: vrsteRakije.naziv }).from(vrsteRakije).where(eq(vrsteRakije.id, d.vrstaRakijeId));
    vrsta = vr?.naziv ?? null;
  }
  return {
    tip: "destilat",
    naslov: `${sr.koraci.destilat}: ${d.oznaka}`,
    datum: d.datum,
    referencaId: d.id,
    detalji: [
      vrsta ? `${sr.polja.vrstaRakije}: ${vrsta}` : "",
      `${sr.polja.kolicinaL}: ${litara(d.kolicinaL)}`,
      `${sr.polja.jacina}: ${procenat(d.jacina)}`,
      d.cistAlkoholL ? `${sr.pojmovi.cistAlkohol}: ${litara(d.cistAlkoholL)}` : "",
    ].filter(Boolean),
  };
}

/** Koraci prodaje datog lota (po destilatId ili po lot tekstu). */
async function koraciProdaje(d: DestilatRed): Promise<KorakLanca[]> {
  const redovi = await db
    .select({
      broj: prodaja.broj,
      datum: prodaja.datum,
      kupac: kupci.naziv,
      kolicina: prodajaStavke.kolicina,
    })
    .from(prodajaStavke)
    .innerJoin(prodaja, eq(prodaja.id, prodajaStavke.prodajaId))
    .leftJoin(kupci, eq(kupci.id, prodaja.kupacId))
    .where(or(eq(prodajaStavke.destilatId, d.id), eq(prodajaStavke.lot, d.oznaka)));

  return redovi.map((r) => ({
    tip: "prodaja" as const,
    naslov: `${sr.koraci.prodaja}${r.broj ? `: ${r.broj}` : ""}`,
    datum: r.datum,
    detalji: [r.kupac ? `${sr.prodajaUI.kupac}: ${r.kupac}` : "", `${broj(r.kolicina, 0)} ${sr.magacin.komada}`].filter(
      Boolean,
    ),
  }));
}

/** Lanac za sud (po QR kodu). */
export async function sastaviLanacZaSud(qrKod: string): Promise<Lanac | null> {
  const [sud] = await db.select().from(sudovi).where(eq(sudovi.qrKod, qrKod));
  if (!sud) return null;

  const koraci: KorakLanca[] = [];
  if (sud.destilatId) {
    const [d] = await db.select().from(destilati).where(eq(destilati.id, sud.destilatId));
    if (d) {
      koraci.push(...(await koraciPorekla(d)));
      koraci.push(await korakDestilata(d));
    }
  }

  const punjenja = await db.select().from(punjenje).where(eq(punjenje.sudId, sud.id));
  for (const p of punjenja) {
    koraci.push({
      tip: "punjenje",
      naslov: sr.koraci.punjenje,
      datum: p.datum,
      referencaId: p.id,
      detalji: [p.kolicinaL ? `${sr.polja.kolicinaL}: ${litara(p.kolicinaL)}` : fmtDatum(p.datum)].filter(Boolean),
    });
  }

  koraci.push({
    tip: "sud",
    naslov: `${sr.koraci.sud}: ${sud.oznaka}`,
    referencaId: sud.id,
    detalji: [
      `${sr.polja.tipSuda}: ${sr.tipSuda[sud.tip as keyof typeof sr.tipSuda]}`,
      `${sr.pojmovi.kolicina}: ${litara(sud.trenutnaKolicinaL)}`,
      sud.lokacija ? `${sr.polja.lokacija}: ${sud.lokacija}` : "",
    ].filter(Boolean),
  });

  return sastaviLanac(qrKod, koraci);
}

/** Lanac za lot (po oznaci destilata): poreklo → destilat → punjenja → prodaje. */
export async function sastaviLanacZaLot(oznaka: string): Promise<Lanac | null> {
  const [d] = await db
    .select()
    .from(destilati)
    .where(eq(destilati.oznaka, oznaka))
    .orderBy(desc(destilati.createdAt))
    .limit(1);
  if (!d) return null;

  const koraci: KorakLanca[] = [];
  koraci.push(...(await koraciPorekla(d)));
  koraci.push(await korakDestilata(d));

  const punjenja = await db.select().from(punjenje).where(eq(punjenje.destilatId, d.id));
  for (const p of punjenja) {
    koraci.push({
      tip: "punjenje",
      naslov: sr.koraci.punjenje,
      datum: p.datum,
      referencaId: p.id,
      detalji: [p.kolicinaL ? `${sr.polja.kolicinaL}: ${litara(p.kolicinaL)}` : fmtDatum(p.datum)].filter(Boolean),
    });
  }

  koraci.push(...(await koraciProdaje(d)));

  return sastaviLanac(oznaka, koraci);
}
