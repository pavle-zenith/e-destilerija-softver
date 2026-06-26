import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { asc } from "drizzle-orm";
import { ChevronLeft } from "lucide-react";
import QRCode from "qrcode";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { qrSadrzaj } from "@/lib/qr";
import { db } from "@/db";
import { sudovi } from "@/db/schema/magacin";
import { DugmeStampa } from "@/modules/sledljivost/dugme-stampa";

export const dynamic = "force-dynamic";

async function baznaAdresa(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export default async function NalepniceStranica() {
  const baza = await baznaAdresa();
  const lista = await db
    .select({ id: sudovi.id, oznaka: sudovi.oznaka, tip: sudovi.tip, qrKod: sudovi.qrKod, lokacija: sudovi.lokacija })
    .from(sudovi)
    .orderBy(asc(sudovi.oznaka));

  const nalepnice = await Promise.all(
    lista.map(async (s) => ({
      ...s,
      slika: await QRCode.toDataURL(qrSadrzaj(s.qrKod, baza), { margin: 1, width: 300 }),
    })),
  );

  return (
    <div>
      <div className="print:hidden">
        <Link
          href="/sledljivost"
          className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-amber-700"
        >
          <ChevronLeft className="h-4 w-4" />
          {sr.nav.sledljivost}
        </Link>
        <PageHeader naslov={sr.sledljivostUI.nalepnice} opis={sr.proizvodnja.entiteti.sudovi.opis} akcija={<DugmeStampa />} />
      </div>

      {nalepnice.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-400 print:hidden">
          {sr.forma.nemaUnosa}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-3">
          {nalepnice.map((n) => (
            <div
              key={n.id}
              className="flex break-inside-avoid flex-col items-center rounded-xl border border-neutral-300 bg-white p-4 text-center"
            >
              <Image src={n.slika} alt={n.qrKod} width={160} height={160} className="h-40 w-40" unoptimized />
              <p className="mt-2 text-base font-bold text-neutral-900">{n.oznaka}</p>
              <p className="text-xs text-neutral-500">{sr.tipSuda[n.tip as keyof typeof sr.tipSuda]}</p>
              <p className="font-mono text-[10px] text-neutral-400">{n.qrKod}</p>
              <p className="mt-1 text-[10px] text-neutral-400">{sr.sledljivostUI.skenirajte}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
