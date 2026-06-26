/**
 * Dashboard podaci: KPI brojke i prodaja po mesecima (čist alkohol).
 */
import "server-only";
import { and, desc, eq, gte, isNull, lte, sql } from "drizzle-orm";
import { db } from "@/db";
import { proizvodnePartije } from "@/db/schema/proizvodnja";
import { prodaja, prodajaStavke } from "@/db/schema/prodaja";
import { akcizaStopa } from "@/db/schema/sifarnici";
import { obavestenja } from "@/db/schema/obavestenja";
import { ucitajStanjeProizvoda } from "@/modules/magacin/stanje";
import { periodZaDatum, obracunajAkcizu } from "@/lib/akciza";

const iso = (d: Date) => d.toISOString().slice(0, 10);

export interface Kpi {
  aktivnePartije: number;
  bocaNaStanju: number;
  akcizaTekuciPeriod: number;
  novaObavestenja: number;
}

export async function ucitajKpi(): Promise<Kpi> {
  const per = periodZaDatum(new Date());
  const odIso = iso(per.od);
  const doIso = iso(per.do);

  const [partije, stanje, periodSum, stopaRed, nova] = await Promise.all([
    db
      .select({ n: sql<number>`count(*)::int` })
      .from(proizvodnePartije)
      .where(isNull(proizvodnePartije.datumKraja)),
    ucitajStanjeProizvoda(),
    db
      .select({ litara: sql<number>`coalesce(sum(${prodajaStavke.cistAlkoholL}), 0)::float8` })
      .from(prodajaStavke)
      .innerJoin(prodaja, eq(prodaja.id, prodajaStavke.prodajaId))
      .where(and(gte(prodaja.datum, odIso), lte(prodaja.datum, doIso))),
    db
      .select({ stopa: akcizaStopa.rsdPoLitruCistogAlkohola })
      .from(akcizaStopa)
      .where(lte(akcizaStopa.vaziOd, doIso))
      .orderBy(desc(akcizaStopa.vaziOd))
      .limit(1),
    db.select({ n: sql<number>`count(*)::int` }).from(obavestenja).where(eq(obavestenja.status, "novo")),
  ]);

  const litara = Number(periodSum[0]?.litara ?? 0);
  const stopa = Number(stopaRed[0]?.stopa ?? 0);

  return {
    aktivnePartije: partije[0]?.n ?? 0,
    bocaNaStanju: stanje.filter((p) => p.stanje > 0).reduce((s, p) => s + p.stanje, 0),
    akcizaTekuciPeriod: obracunajAkcizu(litara, stopa),
    novaObavestenja: nova[0]?.n ?? 0,
  };
}

export interface MesecnaProdaja {
  labela: string;
  vrednost: number;
}

export async function ucitajProdajaPoMesecima(): Promise<MesecnaProdaja[]> {
  const redovi = (await db.execute(sql`
    select extract(year from p.datum)::int as g,
           extract(month from p.datum)::int as m,
           coalesce(sum(s.cist_alkohol_l), 0)::float8 as litara
    from prodaja_stavke s
    join prodaja p on p.id = s.prodaja_id
    group by 1, 2
    order by 1, 2
  `)) as unknown as Array<{ g: number; m: number; litara: number }>;

  return Array.from(redovi).map((r) => ({
    labela: `${String(r.m).padStart(2, "0")}/${String(r.g).slice(2)}`,
    vrednost: r.litara,
  }));
}
