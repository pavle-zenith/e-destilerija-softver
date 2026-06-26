/**
 * Sklapanje lanca sledljivosti za sud (po QR kodu):
 *   sirovina → partija → destilat → (egalizacija) → punjenje → sud
 * Server upiti; sklapanje koristi čistu funkciju iz `@/lib/sledljivost`.
 */
import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { destilati, proizvodnePartije, sirovine, egalizacija, egalizacijaUlazi } from "@/db/schema/proizvodnja";
import { sudovi, punjenje } from "@/db/schema/magacin";
import { dobavljaci, vrsteRakije } from "@/db/schema/sifarnici";
import { sastaviLanac, type KorakLanca, type Lanac } from "@/lib/sledljivost";
import { sr } from "@/i18n/sr";
import { litara, procenat, broj, datum as fmtDatum } from "@/i18n/format";

export async function sastaviLanacZaSud(qrKod: string): Promise<Lanac | null> {
  const [sud] = await db.select().from(sudovi).where(eq(sudovi.qrKod, qrKod));
  if (!sud) return null;

  const koraci: (KorakLanca | null)[] = [];

  let destilatRed: typeof destilati.$inferSelect | undefined;
  if (sud.destilatId) {
    [destilatRed] = await db.select().from(destilati).where(eq(destilati.id, sud.destilatId));
  }

  if (destilatRed) {
    // Da li je destilat nastao egalizacijom?
    const [eg] = await db.select().from(egalizacija).where(eq(egalizacija.rezultatDestilatId, destilatRed.id));

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
    } else if (destilatRed.partijaId) {
      const [partija] = await db
        .select()
        .from(proizvodnePartije)
        .where(eq(proizvodnePartije.id, destilatRed.partijaId));
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

    // Vrsta rakije destilata (radi opisa)
    let vrstaNaziv: string | null = null;
    if (destilatRed.vrstaRakijeId) {
      const [vr] = await db
        .select({ naziv: vrsteRakije.naziv })
        .from(vrsteRakije)
        .where(eq(vrsteRakije.id, destilatRed.vrstaRakijeId));
      vrstaNaziv = vr?.naziv ?? null;
    }

    koraci.push({
      tip: "destilat",
      naslov: `${sr.koraci.destilat}: ${destilatRed.oznaka}`,
      datum: destilatRed.datum,
      referencaId: destilatRed.id,
      detalji: [
        vrstaNaziv ? `${sr.polja.vrstaRakije}: ${vrstaNaziv}` : "",
        `${sr.polja.kolicinaL}: ${litara(destilatRed.kolicinaL)}`,
        `${sr.polja.jacina}: ${procenat(destilatRed.jacina)}`,
        destilatRed.cistAlkoholL ? `${sr.pojmovi.cistAlkohol}: ${litara(destilatRed.cistAlkoholL)}` : "",
      ].filter(Boolean),
    });
  }

  // Punjenja u ovaj sud
  const punjenja = await db.select().from(punjenje).where(eq(punjenje.sudId, sud.id));
  for (const p of punjenja) {
    koraci.push({
      tip: "punjenje",
      naslov: sr.koraci.punjenje,
      datum: p.datum,
      referencaId: p.id,
      detalji: [p.kolicinaL ? `${sr.polja.kolicinaL}: ${litara(p.kolicinaL)}` : `${fmtDatum(p.datum)}`].filter(
        Boolean,
      ),
    });
  }

  // Sud (trenutno stanje)
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
