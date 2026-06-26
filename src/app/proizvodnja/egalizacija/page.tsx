import Link from "next/link";
import { asc, desc, eq, sql } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { datum as fmtDatum } from "@/i18n/format";
import { db } from "@/db";
import { destilati, egalizacija, egalizacijaUlazi, vrsteRakije } from "@/db/schema";
import { EgalizacijaForma } from "@/modules/proizvodnja/egalizacija-forma";

export const dynamic = "force-dynamic";

export default async function EgalizacijaStranica() {
  const [destilatiOpcije, vrste, dogadjaji, brojevi] = await Promise.all([
    db
      .select({ id: destilati.id, oznaka: destilati.oznaka, jacina: destilati.jacina })
      .from(destilati)
      .orderBy(desc(destilati.datum)),
    db
      .select({ vrednost: vrsteRakije.id, labela: vrsteRakije.naziv })
      .from(vrsteRakije)
      .orderBy(asc(vrsteRakije.naziv)),
    db
      .select({
        id: egalizacija.id,
        oznaka: egalizacija.oznaka,
        datum: egalizacija.datum,
        rezultatOznaka: destilati.oznaka,
      })
      .from(egalizacija)
      .leftJoin(destilati, eq(destilati.id, egalizacija.rezultatDestilatId))
      .orderBy(desc(egalizacija.datum)),
    db
      .select({ egId: egalizacijaUlazi.egalizacijaId, n: sql<number>`count(*)::int` })
      .from(egalizacijaUlazi)
      .groupBy(egalizacijaUlazi.egalizacijaId),
  ]);

  const brojUlaza = new Map(brojevi.map((b) => [b.egId, b.n]));

  return (
    <div>
      <Link
        href="/proizvodnja"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-amber-700"
      >
        <ChevronLeft className="h-4 w-4" />
        {sr.nav.proizvodnja}
      </Link>
      <PageHeader naslov={sr.egalizacija.naslov} opis={sr.egalizacija.opis} />

      <EgalizacijaForma destilati={destilatiOpcije} vrsteRakije={vrste} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        {dogadjaji.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-400">{sr.forma.nemaUnosa}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-medium">{sr.egalizacija.oznakaPolja}</th>
                <th className="px-4 py-3 font-medium">{sr.polja.datum}</th>
                <th className="px-4 py-3 font-medium">{sr.egalizacija.rezultat}</th>
                <th className="px-4 py-3 font-medium">{sr.egalizacija.brojUlaza}</th>
              </tr>
            </thead>
            <tbody>
              {dogadjaji.map((d) => (
                <tr key={d.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-800">{d.oznaka}</td>
                  <td className="px-4 py-3 text-neutral-700">{fmtDatum(d.datum)}</td>
                  <td className="px-4 py-3 text-neutral-700">{d.rezultatOznaka ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">{brojUlaza.get(d.id) ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
