import { asc, desc, eq } from "drizzle-orm";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { datum as fmtDatum, dinar } from "@/i18n/format";
import { db } from "@/db";
import { prodaja } from "@/db/schema/prodaja";
import { kupci, proizvodi, akcizaStopa } from "@/db/schema/sifarnici";
import { destilati } from "@/db/schema/proizvodnja";
import { ProdajaForma } from "@/modules/prodaja/forma";

export const dynamic = "force-dynamic";

export default async function ProdajaStranica() {
  const [kupciOpcije, proizvodiOpcije, lotovi, stopaRed, racuni] = await Promise.all([
    db.select({ vrednost: kupci.id, labela: kupci.naziv }).from(kupci).orderBy(asc(kupci.naziv)),
    db
      .select({ vrednost: proizvodi.id, labela: proizvodi.naziv, zapreminaL: proizvodi.zapreminaL, jacina: proizvodi.jacina })
      .from(proizvodi)
      .orderBy(asc(proizvodi.naziv)),
    db
      .select({ vrednost: destilati.id, labela: destilati.oznaka, jacina: destilati.jacina })
      .from(destilati)
      .orderBy(desc(destilati.datum)),
    db
      .select({ stopa: akcizaStopa.rsdPoLitruCistogAlkohola })
      .from(akcizaStopa)
      .orderBy(desc(akcizaStopa.vaziOd))
      .limit(1),
    db
      .select({
        id: prodaja.id,
        broj: prodaja.broj,
        datum: prodaja.datum,
        kupac: kupci.naziv,
        iznos: prodaja.ukupnoBezAkcize,
        akciza: prodaja.ukupnoAkciza,
      })
      .from(prodaja)
      .leftJoin(kupci, eq(kupci.id, prodaja.kupacId))
      .orderBy(desc(prodaja.datum)),
  ]);

  const stopa = Number(stopaRed[0]?.stopa ?? 0);

  return (
    <div>
      <PageHeader naslov={sr.nav.prodaja} opis={sr.prodajaUI.opis} />

      <ProdajaForma kupci={kupciOpcije} proizvodi={proizvodiOpcije} lotovi={lotovi} stopa={stopa} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        {racuni.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-400">{sr.forma.nemaUnosa}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-medium">{sr.prodajaUI.broj}</th>
                <th className="px-4 py-3 font-medium">{sr.polja.datum}</th>
                <th className="px-4 py-3 font-medium">{sr.prodajaUI.kupac}</th>
                <th className="px-4 py-3 font-medium">{sr.prodajaUI.ukupnoIznos}</th>
                <th className="px-4 py-3 font-medium">{sr.akciza.obracunato}</th>
              </tr>
            </thead>
            <tbody>
              {racuni.map((r) => (
                <tr key={r.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-800">{r.broj ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">{fmtDatum(r.datum)}</td>
                  <td className="px-4 py-3 text-neutral-700">{r.kupac ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">{r.iznos ? dinar(r.iznos) : "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">{r.akciza ? dinar(r.akciza) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
