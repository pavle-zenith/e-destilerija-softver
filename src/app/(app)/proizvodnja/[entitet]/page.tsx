import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { pronadjiEntitet } from "@/modules/crud/entiteti";
import { ucitajListu, ucitajOpcije } from "@/modules/crud/podaci";
import { EntitetTabela } from "@/modules/crud/tabela";

// Podaci iz baze se čitaju po zahtevu — bez statičkog prerendera na build-u.
export const dynamic = "force-dynamic";

export default async function EntitetStranica({
  params,
}: {
  params: Promise<{ entitet: string }>;
}) {
  const { entitet } = await params;
  const meta = pronadjiEntitet(entitet, "/proizvodnja");
  if (!meta) notFound();

  const [podaci, opcije] = await Promise.all([ucitajListu(entitet), ucitajOpcije(entitet)]);

  return (
    <div>
      <Link
        href="/proizvodnja"
        className="mb-3 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-indigo-600"
      >
        <ChevronLeft className="h-4 w-4" />
        {sr.nav.proizvodnja}
      </Link>
      <PageHeader naslov={meta.mn} opis={meta.opis} />
      <EntitetTabela meta={meta} opcije={opcije} podaci={podaci} />
    </div>
  );
}
