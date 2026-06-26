import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { sastaviLanacZaLot } from "@/modules/sledljivost/lanac";
import { LanacPrikaz } from "@/modules/sledljivost/prikaz";

export const dynamic = "force-dynamic";

export default async function LotStranica({ params }: { params: Promise<{ oznaka: string }> }) {
  const { oznaka } = await params;
  const dekodiran = decodeURIComponent(oznaka);
  const lanac = await sastaviLanacZaLot(dekodiran);

  return (
    <div>
      <Link
        href="/sledljivost"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-indigo-600"
      >
        <ChevronLeft className="h-4 w-4" />
        {sr.nav.sledljivost}
      </Link>
      <PageHeader naslov={`${sr.koraci.destilat}: ${dekodiran}`} opis={sr.sledljivostUI.lanac} />

      {!lanac ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-400">
          {sr.sledljivostUI.nemaLanca}
        </div>
      ) : (
        <LanacPrikaz lanac={lanac} />
      )}
    </div>
  );
}
