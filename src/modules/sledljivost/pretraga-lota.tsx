"use client";

import { useState, useTransition } from "react";
import { sr } from "@/i18n/sr";
import { LanacPrikaz } from "./prikaz";
import { ucitajLanacLota } from "./akcije";
import type { Lanac } from "@/lib/sledljivost";

/** Izbor lota → istorija (lanac) se učitava odmah ispod, bez prelaska na drugu stranicu. */
export function PretragaLota({ lotovi }: { lotovi: { oznaka: string }[] }) {
  const [izabran, setIzabran] = useState("");
  const [lanac, setLanac] = useState<Lanac | null>(null);
  const [ucitava, startUcitavanje] = useTransition();

  function izaberi(oznaka: string) {
    setIzabran(oznaka);
    if (!oznaka) {
      setLanac(null);
      return;
    }
    startUcitavanje(async () => {
      setLanac(await ucitajLanacLota(oznaka));
    });
  }

  return (
    <div>
      <select
        value={izabran}
        onChange={(e) => izaberi(e.target.value)}
        className="w-full max-w-xs rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      >
        <option value="">{sr.egalizacija.izaberiDestilat}</option>
        {lotovi.map((l) => (
          <option key={l.oznaka} value={l.oznaka}>
            {l.oznaka}
          </option>
        ))}
      </select>

      {izabran ? (
        <div className="mt-4">
          {ucitava ? (
            <p className="text-sm text-neutral-400">{sr.stanje.ucitavanje}</p>
          ) : lanac ? (
            <LanacPrikaz lanac={lanac} />
          ) : (
            <p className="text-sm text-neutral-400">{sr.sledljivostUI.nemaLanca}</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
