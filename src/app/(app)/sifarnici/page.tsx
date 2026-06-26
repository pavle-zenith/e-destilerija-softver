import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { entitetiZaPutanju } from "@/modules/crud/entiteti";

export default function SifarniciStranica() {
  return (
    <div>
      <PageHeader naslov={sr.nav.sifarnici} opis={sr.sifarnici.opis} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entitetiZaPutanju("/sifarnici").map((meta) => (
          <Link
            key={meta.kljuc}
            href={`/sifarnici/${meta.kljuc}`}
            className="group flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-5 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
          >
            <div>
              <p className="font-semibold text-neutral-900">{meta.mn}</p>
              <p className="mt-1 text-sm text-neutral-500">{meta.opis}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-neutral-300 group-hover:text-indigo-500" />
          </Link>
        ))}
      </div>
    </div>
  );
}
