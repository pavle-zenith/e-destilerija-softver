import {
  Sprout,
  FlaskConical,
  Droplets,
  Combine,
  ArrowDownToLine,
  Container,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { datum as fmtDatum } from "@/i18n/format";
import type { KorakTip, Lanac } from "@/lib/sledljivost";

const IKONE: Record<KorakTip, LucideIcon> = {
  sirovina: Sprout,
  partija: FlaskConical,
  destilat: Droplets,
  egalizacija: Combine,
  punjenje: ArrowDownToLine,
  sud: Container,
  prodaja: ShoppingCart,
};

export function LanacPrikaz({ lanac }: { lanac: Lanac }) {
  return (
    <ol className="relative space-y-0">
      {lanac.koraci.map((korak, i) => {
        const Ikona = IKONE[korak.tip];
        const poslednji = i === lanac.koraci.length - 1;
        return (
          <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
            {!poslednji ? (
              <span className="absolute left-5 top-10 h-full w-px bg-neutral-200" aria-hidden />
            ) : null}
            <div className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50">
              <Ikona className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1 rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-neutral-900">{korak.naslov}</p>
                {korak.datum ? <span className="text-xs text-neutral-400">{fmtDatum(korak.datum)}</span> : null}
              </div>
              {korak.detalji.length > 0 ? (
                <ul className="mt-2 space-y-0.5 text-sm text-neutral-600">
                  {korak.detalji.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
