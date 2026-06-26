import Link from "next/link";
import { asc, desc } from "drizzle-orm";
import { QrCode, Printer, ChevronRight, Search } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { litara } from "@/i18n/format";
import { db } from "@/db";
import { sudovi } from "@/db/schema/magacin";
import { destilati } from "@/db/schema/proizvodnja";
import { Dugme } from "@/components/ui/dugme";
import { PretragaLota } from "@/modules/sledljivost/pretraga-lota";

export const dynamic = "force-dynamic";

export default async function SledljivostStranica() {
  const [lista, lotovi] = await Promise.all([
    db
      .select({
        id: sudovi.id,
        oznaka: sudovi.oznaka,
        tip: sudovi.tip,
        qrKod: sudovi.qrKod,
        trenutnaKolicinaL: sudovi.trenutnaKolicinaL,
        lokacija: sudovi.lokacija,
      })
      .from(sudovi)
      .orderBy(asc(sudovi.oznaka)),
    db.select({ oznaka: destilati.oznaka }).from(destilati).orderBy(desc(destilati.datum)),
  ]);

  return (
    <div>
      <PageHeader
        naslov={sr.nav.sledljivost}
        opis={sr.sledljivostUI.opis}
        akcija={
          <Link href="/sledljivost/nalepnice">
            <Dugme varijanta="sporedno">
              <Printer className="h-4 w-4" />
              {sr.sledljivostUI.nalepnice}
            </Dugme>
          </Link>
        }
      />

      <div className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4">
        <p className="mb-2 flex items-center gap-2 text-sm font-medium text-neutral-700">
          <Search className="h-4 w-4 text-indigo-600" />
          {sr.koraci.destilat} / lot
        </p>
        {lotovi.length === 0 ? (
          <p className="text-sm text-neutral-400">{sr.sledljivostUI.bezLotova}</p>
        ) : (
          <PretragaLota lotovi={lotovi} />
        )}
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {sr.proizvodnja.entiteti.sudovi.mn}
      </h2>
      {lista.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-400">
          {sr.sledljivostUI.bezSudova}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((s) => (
            <Link
              key={s.id}
              href={`/sledljivost/qr/${encodeURIComponent(s.qrKod)}`}
              className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
            >
              <div className="flex items-center gap-3">
                <QrCode className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="font-semibold text-neutral-900">{s.oznaka}</p>
                  <p className="text-xs text-neutral-500">
                    {sr.tipSuda[s.tip as keyof typeof sr.tipSuda]} · {litara(s.trenutnaKolicinaL)}
                  </p>
                  <p className="font-mono text-xs text-neutral-400">{s.qrKod}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300 group-hover:text-indigo-500" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
