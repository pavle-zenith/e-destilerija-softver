import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { datum as fmtDatum, dinar, litara, broj } from "@/i18n/format";
import { DugmeStampa } from "@/modules/sledljivost/dugme-stampa";
import { ucitajObracun } from "@/modules/akcize/podaci";

export const dynamic = "force-dynamic";

export default async function PpOaStranica({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const podaci = await ucitajObracun(id);
  if (!podaci) notFound();
  const { obracun: o, firma } = podaci;

  const stavka = (labela: string, vrednost: string) => (
    <div className="flex justify-between border-b border-neutral-100 py-2 last:border-0">
      <span className="text-neutral-500">{labela}</span>
      <span className="font-medium text-neutral-900">{vrednost}</span>
    </div>
  );

  return (
    <div>
      <div className="print:hidden">
        <Link
          href="/akcize"
          className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-indigo-600"
        >
          <ChevronLeft className="h-4 w-4" />
          {sr.nav.akcize}
        </Link>
        <PageHeader naslov={sr.akcizeUI.ppOaNaslov} opis={sr.akciza.pp0a} akcija={<DugmeStampa />} />
      </div>

      <div className="mx-auto max-w-xl rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="mb-4 border-b border-neutral-200 pb-4">
          <p className="text-lg font-bold text-neutral-900">{firma?.nazivFirme ?? "—"}</p>
          <p className="text-sm text-neutral-500">
            {firma?.pib ? `PIB: ${firma.pib}` : ""} {firma?.maticniBroj ? `· MB: ${firma.maticniBroj}` : ""}
          </p>
          {firma?.adresa ? <p className="text-sm text-neutral-500">{firma.adresa}</p> : null}
        </div>

        <h2 className="mb-3 text-base font-semibold text-neutral-900">{sr.akcizeUI.ppOaNaslov}</h2>
        {stavka(sr.akcizeUI.period, `${String(o.mesec).padStart(2, "0")}/${o.godina} · ${o.deo === 1 ? "1–15" : "16–kraj"}`)}
        {stavka(sr.pojmovi.period, `${fmtDatum(o.periodOd)} – ${fmtDatum(o.periodDo)}`)}
        {stavka(sr.akciza.litaraCistogAlkohola, litara(o.litaraCistogAlkohola))}
        {stavka(sr.akcizeUI.stopa, `${broj(o.stopa, 4)} RSD/L`)}
        {stavka(sr.pojmovi.iznos, dinar(o.iznos))}
        {stavka(sr.akciza.rokPlacanja, fmtDatum(o.rok))}
        {stavka(sr.magacin.status, o.status === "placeno" ? `${sr.akciza.placeno} (${fmtDatum(o.datumPlacanja)})` : sr.akciza.obracunato)}
      </div>
    </div>
  );
}
