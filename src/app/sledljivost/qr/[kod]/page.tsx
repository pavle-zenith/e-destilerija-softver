import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { ChevronLeft } from "lucide-react";
import QRCode from "qrcode";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { qrSadrzaj } from "@/lib/qr";
import { sastaviLanacZaSud } from "@/modules/sledljivost/lanac";
import { LanacPrikaz } from "@/modules/sledljivost/prikaz";

export const dynamic = "force-dynamic";

async function baznaAdresa(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function LanacStranica({ params }: { params: Promise<{ kod: string }> }) {
  const { kod } = await params;
  const dekodiran = decodeURIComponent(kod);
  const lanac = await sastaviLanacZaSud(dekodiran);

  const qrSlika = await QRCode.toDataURL(qrSadrzaj(dekodiran, await baznaAdresa()), { margin: 1, width: 240 });

  return (
    <div>
      <Link
        href="/sledljivost"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-amber-700"
      >
        <ChevronLeft className="h-4 w-4" />
        {sr.nav.sledljivost}
      </Link>
      <PageHeader naslov={sr.sledljivostUI.lanac} opis={dekodiran} />

      {!lanac ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-400">
          {sr.sledljivostUI.nemaLanca}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_240px]">
          <div className="order-2 lg:order-1">
            <LanacPrikaz lanac={lanac} />
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 text-center">
              <Image src={qrSlika} alt={dekodiran} width={200} height={200} className="mx-auto" unoptimized />
              <p className="mt-2 font-mono text-xs text-neutral-500">{dekodiran}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
