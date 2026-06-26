/**
 * Stanje magacina — izvedeno iz `magacin_promet` (ulaz − izlaz) za proizvode (boce)
 * i iz `sudovi.trenutnaKolicinaL` za rinfuz. Sve čisto serverski.
 */
import "server-only";
import { asc, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { magacinPromet, sudovi } from "@/db/schema/magacin";
import { proizvodi } from "@/db/schema/sifarnici";

export type StatusZaliha = "dovoljno" | "nisko" | "nema";

export interface StanjeProizvoda {
  id: string;
  naziv: string;
  zapreminaL: string;
  jacina: string;
  prag: string | null;
  stanje: number; // broj jedinica (boca)
  status: StatusZaliha;
}

export interface StanjeSuda {
  id: string;
  oznaka: string;
  tip: string;
  trenutnaKolicinaL: string;
  kapacitetL: string | null;
  lokacija: string | null;
  popunjenost: number | null; // 0..1
}

function status(stanje: number, prag: number | null): StatusZaliha {
  if (stanje <= 0) return "nema";
  if (prag != null && prag > 0 && stanje <= prag) return "nisko";
  return "dovoljno";
}

export async function ucitajStanjeProizvoda(): Promise<StanjeProizvoda[]> {
  const [svi, promet] = await Promise.all([
    db
      .select({
        id: proizvodi.id,
        naziv: proizvodi.naziv,
        zapreminaL: proizvodi.zapreminaL,
        jacina: proizvodi.jacina,
        prag: proizvodi.pragNiskihZaliha,
        aktivan: proizvodi.aktivan,
      })
      .from(proizvodi)
      .orderBy(asc(proizvodi.naziv)),
    db
      .select({
        proizvodId: magacinPromet.proizvodId,
        stanje: sql<string>`coalesce(sum(case when ${magacinPromet.tip} = 'ulaz' then ${magacinPromet.kolicina} else -${magacinPromet.kolicina} end), 0)`,
      })
      .from(magacinPromet)
      .where(isNotNull(magacinPromet.proizvodId))
      .groupBy(magacinPromet.proizvodId),
  ]);

  const stanjePoId = new Map(promet.map((p) => [p.proizvodId, Number(p.stanje)]));

  return svi
    .filter((p) => p.aktivan)
    .map((p) => {
      const stanje = stanjePoId.get(p.id) ?? 0;
      const prag = p.prag != null ? Number(p.prag) : null;
      return {
        id: p.id,
        naziv: p.naziv,
        zapreminaL: p.zapreminaL,
        jacina: p.jacina,
        prag: p.prag,
        stanje,
        status: status(stanje, prag),
      };
    });
}

export async function ucitajStanjeSudova(): Promise<StanjeSuda[]> {
  const redovi = await db
    .select({
      id: sudovi.id,
      oznaka: sudovi.oznaka,
      tip: sudovi.tip,
      trenutnaKolicinaL: sudovi.trenutnaKolicinaL,
      kapacitetL: sudovi.kapacitetL,
      lokacija: sudovi.lokacija,
    })
    .from(sudovi)
    .orderBy(asc(sudovi.oznaka));

  return redovi.map((s) => {
    const trenutna = Number(s.trenutnaKolicinaL);
    const kapacitet = s.kapacitetL != null ? Number(s.kapacitetL) : null;
    return {
      ...s,
      popunjenost: kapacitet && kapacitet > 0 ? Math.min(1, trenutna / kapacitet) : null,
    };
  });
}
