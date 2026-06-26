import Link from "next/link";
import { asc, desc, eq } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { datum as fmtDatum, litara, broj } from "@/i18n/format";
import { db } from "@/db";
import { punjenje, sudovi as sudoviT, magacinPromet } from "@/db/schema/magacin";
import { destilati } from "@/db/schema/proizvodnja";
import { proizvodi as proizvodiT } from "@/db/schema/sifarnici";
import { PunjenjeForma } from "@/modules/proizvodnja/punjenje-forma";

export const dynamic = "force-dynamic";

export default async function PunjenjeStranica() {
  const sudDest = sudoviT;
  const [destilatiOpcije, sudoviOpcije, proizvodiOpcije, dogadjaji] = await Promise.all([
    db.select({ vrednost: destilati.id, labela: destilati.oznaka }).from(destilati).orderBy(desc(destilati.datum)),
    db.select({ vrednost: sudDest.id, labela: sudDest.oznaka }).from(sudDest).orderBy(asc(sudDest.oznaka)),
    db
      .select({ vrednost: proizvodiT.id, labela: proizvodiT.naziv, zapreminaL: proizvodiT.zapreminaL })
      .from(proizvodiT)
      .orderBy(asc(proizvodiT.naziv)),
    db
      .select({
        id: punjenje.id,
        datum: punjenje.datum,
        destilatOznaka: destilati.oznaka,
        sudOznaka: sudDest.oznaka,
        proizvodNaziv: proizvodiT.naziv,
        kolicinaL: punjenje.kolicinaL,
        brojJedinica: punjenje.brojJedinica,
      })
      .from(punjenje)
      .leftJoin(destilati, eq(destilati.id, punjenje.destilatId))
      .leftJoin(sudDest, eq(sudDest.id, punjenje.sudId))
      .leftJoin(proizvodiT, eq(proizvodiT.id, punjenje.proizvodId))
      .orderBy(desc(punjenje.datum)),
  ]);

  // (magacinPromet se puni u akciji; ovde ga ne prikazujemo — vidi Magacin u Fazi 3)
  void magacinPromet;

  return (
    <div>
      <Link
        href="/proizvodnja"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-amber-700"
      >
        <ChevronLeft className="h-4 w-4" />
        {sr.nav.proizvodnja}
      </Link>
      <PageHeader naslov={sr.punjenje.naslov} opis={sr.punjenje.opis} />

      <PunjenjeForma destilati={destilatiOpcije} sudovi={sudoviOpcije} proizvodi={proizvodiOpcije} />

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        {dogadjaji.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-400">{sr.forma.nemaUnosa}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-medium">{sr.polja.datum}</th>
                <th className="px-4 py-3 font-medium">{sr.polja.destilat}</th>
                <th className="px-4 py-3 font-medium">{sr.koraci.sud} / {sr.pojmovi.proizvodi}</th>
                <th className="px-4 py-3 font-medium">{sr.polja.kolicinaL}</th>
                <th className="px-4 py-3 font-medium">{sr.punjenje.brojBoca}</th>
              </tr>
            </thead>
            <tbody>
              {dogadjaji.map((d) => (
                <tr key={d.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3 text-neutral-700">{fmtDatum(d.datum)}</td>
                  <td className="px-4 py-3 text-neutral-700">{d.destilatOznaka ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">{d.sudOznaka ?? d.proizvodNaziv ?? "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">{d.kolicinaL ? litara(d.kolicinaL) : "—"}</td>
                  <td className="px-4 py-3 text-neutral-700">{d.brojJedinica != null ? broj(d.brojJedinica, 0) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
