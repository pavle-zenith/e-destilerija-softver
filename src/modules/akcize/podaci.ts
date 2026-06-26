/**
 * Akcizni periodi i obračuni — agregacija čistog alkohola iz prodaje po
 * polumesečnom periodu, primena važeće stope i rok plaćanja.
 */
import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { akcizaObracun } from "@/db/schema/akcize";
import { akcizaStopa, podesavanja } from "@/db/schema/sifarnici";
import { granicePerioda, obracunajAkcizu, rokPlacanja, rokIstekao } from "@/lib/akciza";

export interface PeriodRed {
  godina: number;
  mesec: number;
  deo: 1 | 2;
  od: string;
  do: string;
  litara: number;
  stopa: number;
  iznos: number;
  rok: string;
  obracun: { id: string; status: string; datumPlacanja: string | null } | null;
  dospelo: boolean;
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

/** Svi periodi koji imaju prodaju, sa izračunom i statusom obračuna. */
export async function ucitajPeriode(): Promise<PeriodRed[]> {
  const agg = (await db.execute(sql`
    select extract(year from p.datum)::int as godina,
           extract(month from p.datum)::int as mesec,
           (case when extract(day from p.datum) <= 15 then 1 else 2 end)::int as deo,
           coalesce(sum(s.cist_alkohol_l), 0)::float8 as litara
    from prodaja_stavke s
    join prodaja p on p.id = s.prodaja_id
    group by 1, 2, 3
    order by 1 desc, 2 desc, 3 desc
  `)) as unknown as Array<{ godina: number; mesec: number; deo: number; litara: number }>;

  const [stope, pod, obracuni] = await Promise.all([
    db.select().from(akcizaStopa).orderBy(desc(akcizaStopa.vaziOd)),
    db.select().from(podesavanja).limit(1),
    db.select().from(akcizaObracun),
  ]);
  const rokDana = pod[0]?.akcizaRokDana ?? 15;
  const obrMap = new Map(obracuni.map((o) => [`${o.godina}-${o.mesec}-${o.deo}`, o]));
  const danas = new Date();

  return Array.from(agg).map((pr) => {
    const deo = (pr.deo === 1 ? 1 : 2) as 1 | 2;
    const per = granicePerioda(pr.godina, pr.mesec, deo);
    const doIso = iso(per.do);
    const stopa = Number(stope.find((s) => s.vaziOd <= doIso)?.rsdPoLitruCistogAlkohola ?? 0);
    const iznos = obracunajAkcizu(pr.litara, stopa);
    const rok = rokPlacanja(per.do, rokDana);
    const o = obrMap.get(`${pr.godina}-${pr.mesec}-${deo}`) ?? null;
    const placeno = o?.status === "placeno";
    return {
      godina: pr.godina,
      mesec: pr.mesec,
      deo,
      od: iso(per.od),
      do: doIso,
      litara: pr.litara,
      stopa,
      iznos,
      rok: iso(rok),
      obracun: o ? { id: o.id, status: o.status, datumPlacanja: o.datumPlacanja } : null,
      dospelo: !placeno && rokIstekao(rok, danas),
    };
  });
}

/** Jedan obračun + podaci firme (za PP-OA). */
export async function ucitajObracun(id: string) {
  const [o] = await db.select().from(akcizaObracun).where(eq(akcizaObracun.id, id)).limit(1);
  if (!o) return null;
  const [firma] = await db.select().from(podesavanja).limit(1);
  return { obracun: o, firma: firma ?? null };
}
