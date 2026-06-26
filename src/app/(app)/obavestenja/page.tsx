import { desc } from "drizzle-orm";
import { Receipt, AlertTriangle, Info, Check } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { datum as fmtDatum } from "@/i18n/format";
import { Dugme } from "@/components/ui/dugme";
import { db } from "@/db";
import { obavestenja } from "@/db/schema/obavestenja";
import { resiObavestenje } from "@/modules/obavestenja/akcije";

export const dynamic = "force-dynamic";

const IKONA = { akciza_rok: Receipt, niske_zalihe: AlertTriangle, sistem: Info } as const;

export default async function ObavestenjaStranica() {
  const lista = await db.select().from(obavestenja).orderBy(desc(obavestenja.createdAt));

  return (
    <div>
      <PageHeader naslov={sr.nav.obavestenja} opis={sr.obavestenjaUI.opis} />

      {lista.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-400">
          {sr.obavestenjaUI.bezObavestenja}
        </div>
      ) : (
        <div className="space-y-2">
          {lista.map((o) => {
            const Ikona = IKONA[o.tip] ?? Info;
            const reseno = o.status === "reseno";
            return (
              <div
                key={o.id}
                className={`flex items-start gap-3 rounded-2xl border p-4 ${
                  reseno ? "border-neutral-200 bg-neutral-50 opacity-60" : "border-neutral-200 bg-white"
                }`}
              >
                <Ikona className={`mt-0.5 h-5 w-5 shrink-0 ${o.tip === "niske_zalihe" ? "text-indigo-600" : "text-indigo-600"}`} />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{o.naslov}</p>
                  {o.poruka ? <p className="text-sm text-neutral-600">{o.poruka}</p> : null}
                  <p className="mt-1 text-xs text-neutral-400">
                    {sr.obavestenjaUI.tip[o.tip]} · {sr.obavestenjaUI.status[o.status]}
                    {o.rok ? ` · ${sr.akciza.rokPlacanja}: ${fmtDatum(o.rok)}` : ""}
                  </p>
                </div>
                {!reseno ? (
                  <form action={resiObavestenje.bind(null, o.id)}>
                    <Dugme type="submit" varijanta="sporedno" velicina="sm">
                      <Check className="h-4 w-4" />
                      {sr.obavestenjaUI.oznaciReseno}
                    </Dugme>
                  </form>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
