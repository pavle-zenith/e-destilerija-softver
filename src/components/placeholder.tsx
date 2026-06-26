import { Construction } from "lucide-react";
import { PageHeader } from "./page-header";

interface PlaceholderProps {
  naslov: string;
  opis?: string;
  faza?: string;
}

/** Privremena stranica za module koji se grade u kasnijim fazama. */
export function Placeholder({ naslov, opis, faza }: PlaceholderProps) {
  return (
    <div>
      <PageHeader naslov={naslov} opis={opis} />
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-neutral-300 bg-white py-20 text-center">
        <Construction className="h-10 w-10 text-indigo-500" />
        <p className="text-sm font-medium text-neutral-700">Modul u izradi</p>
        {faza ? <p className="text-xs text-neutral-400">{faza}</p> : null}
      </div>
    </div>
  );
}
