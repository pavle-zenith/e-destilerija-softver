import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { RESURSI, jeResursKljuc } from "@/modules/sifarnici/polja";
import { ucitajListu, ucitajOpcije } from "@/modules/sifarnici/podaci";
import { SifarnikTabela } from "@/modules/sifarnici/tabela";

// Podaci iz baze se čitaju po zahtevu — bez statičkog prerendera na build-u.
export const dynamic = "force-dynamic";

export default async function ResursStranica({
  params,
}: {
  params: Promise<{ resurs: string }>;
}) {
  const { resurs } = await params;
  if (!jeResursKljuc(resurs)) notFound();

  const meta = RESURSI[resurs];
  const [podaci, opcije] = await Promise.all([ucitajListu(resurs), ucitajOpcije(resurs)]);

  return (
    <div>
      <Link
        href="/sifarnici"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-amber-700"
      >
        <ChevronLeft className="h-4 w-4" />
        {sr.nav.sifarnici}
      </Link>
      <PageHeader naslov={meta.mn} opis={meta.opis} />
      <SifarnikTabela meta={meta} opcije={opcije} podaci={podaci} />
    </div>
  );
}
