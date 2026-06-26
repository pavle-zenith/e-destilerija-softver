"use client";

import { useRouter } from "next/navigation";
import { sr } from "@/i18n/sr";

/** Izbor lota (destilata) → otvara lanac sledljivosti tog lota. */
export function PretragaLota({ lotovi }: { lotovi: { oznaka: string }[] }) {
  const router = useRouter();
  return (
    <select
      defaultValue=""
      onChange={(e) => {
        if (e.target.value) router.push(`/sledljivost/lot/${encodeURIComponent(e.target.value)}`);
      }}
      className="w-full max-w-xs rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    >
      <option value="">{sr.egalizacija.izaberiDestilat}</option>
      {lotovi.map((l) => (
        <option key={l.oznaka} value={l.oznaka}>
          {l.oznaka}
        </option>
      ))}
    </select>
  );
}
