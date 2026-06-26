import Link from "next/link";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { datum as fmtDatum, dinar, litara, broj } from "@/i18n/format";
import { Dugme } from "@/components/ui/dugme";
import { ucitajPeriode } from "@/modules/akcize/podaci";
import { obracunajPeriod, oznaciPlaceno } from "@/modules/akcize/akcije";

export const dynamic = "force-dynamic";

export default async function AkcizeStranica() {
  const periodi = await ucitajPeriode();

  return (
    <div>
      <PageHeader naslov={sr.nav.akcize} opis="Polumesečni obračun akcize iz prodaje (1–15 i 16–kraj)" />

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        {periodi.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-400">{sr.akcizeUI.nemaObracuna}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-medium">{sr.akcizeUI.period}</th>
                <th className="px-4 py-3 font-medium">{sr.akcizeUI.litaraCistog}</th>
                <th className="px-4 py-3 font-medium">{sr.akcizeUI.stopa}</th>
                <th className="px-4 py-3 font-medium">{sr.pojmovi.iznos}</th>
                <th className="px-4 py-3 font-medium">{sr.akciza.rokPlacanja}</th>
                <th className="px-4 py-3 font-medium">{sr.magacin.status}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {periodi.map((p) => {
                const kljuc = `${p.godina}-${p.mesec}-${p.deo}`;
                const placeno = p.obracun?.status === "placeno";
                return (
                  <tr key={kljuc} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                    <td className="px-4 py-3 text-neutral-800">
                      {String(p.mesec).padStart(2, "0")}/{p.godina} ·{" "}
                      <span className="text-neutral-500">{p.deo === 1 ? "1–15" : "16–kraj"}</span>
                    </td>
                    <td className="px-4 py-3 text-neutral-700">{litara(p.litara)}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {p.stopa > 0 ? `${broj(p.stopa, 2)} RSD/L` : <span className="text-red-600">{sr.akcizeUI.nemaStope}</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-800">{dinar(p.iznos)}</td>
                    <td className={`px-4 py-3 ${p.dospelo ? "font-medium text-red-600" : "text-neutral-700"}`}>
                      {fmtDatum(p.rok)}
                    </td>
                    <td className="px-4 py-3">
                      {placeno ? (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                          {sr.akciza.placeno}
                        </span>
                      ) : p.obracun ? (
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                            p.dospelo ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {p.dospelo ? sr.akcizeUI.dospelo : sr.akciza.obracunato}
                        </span>
                      ) : (
                        <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-500">
                          {sr.akciza.nijePlaceno}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {p.obracun ? (
                          <Link href={`/akcize/${p.obracun.id}`} title={sr.akciza.pp0a}>
                            <Dugme varijanta="sporedno" velicina="sm">
                              <FileText className="h-4 w-4" />
                              PP-OA
                            </Dugme>
                          </Link>
                        ) : null}
                        {!placeno ? (
                          <form action={obracunajPeriod.bind(null, p.godina, p.mesec, p.deo)}>
                            <Dugme type="submit" velicina="sm" varijanta={p.obracun ? "sporedno" : "primarno"}>
                              {sr.akcizeUI.obracunaj}
                            </Dugme>
                          </form>
                        ) : null}
                        {p.obracun && !placeno ? (
                          <form action={oznaciPlaceno.bind(null, p.obracun.id)}>
                            <Dugme type="submit" velicina="sm">
                              {sr.akcizeUI.oznaciPlaceno}
                            </Dugme>
                          </form>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
