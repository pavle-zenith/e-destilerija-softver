import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { entitetiZaPutanju } from "@/modules/crud/entiteti";

export default function ProizvodnjaStranica() {
  return (
    <div>
      <PageHeader naslov={sr.nav.proizvodnja} opis={sr.proizvodnja.opis} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entitetiZaPutanju("/proizvodnja").map((meta) => (
          <Link
            key={meta.kljuc}
            href={`/proizvodnja/${meta.kljuc}`}
            className="group flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-amber-300 hover:bg-amber-50"
          >
            <div>
              <p className="font-semibold text-neutral-900">{meta.mn}</p>
              <p className="mt-1 text-sm text-neutral-500">{meta.opis}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300 group-hover:text-amber-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
