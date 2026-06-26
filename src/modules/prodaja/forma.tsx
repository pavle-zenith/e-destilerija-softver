"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { sr } from "@/i18n/sr";
import { litara, dinar } from "@/i18n/format";
import { Dugme } from "@/components/ui/dugme";
import type { StanjeForme } from "@/modules/crud/tipovi";
import { sacuvajProdaju } from "./akcije";

export interface Opcija {
  vrednost: string;
  labela: string;
}
export interface ProizvodOpcija extends Opcija {
  zapreminaL: string;
  jacina: string;
}
export interface LotOpcija extends Opcija {
  jacina: string;
}

const inputKlase =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

interface Red {
  proizvodId: string;
  destilatId: string;
  boca: string;
  cena: string;
}
const prazanRed: Red = { proizvodId: "", destilatId: "", boca: "", cena: "" };

export function ProdajaForma({
  kupci,
  proizvodi,
  lotovi,
  stopa,
}: {
  kupci: Opcija[];
  proizvodi: ProizvodOpcija[];
  lotovi: LotOpcija[];
  stopa: number;
}) {
  const [redovi, setRedovi] = useState<Red[]>([{ ...prazanRed }]);
  const [verzija, setVerzija] = useState(0);

  const [stanje, formAction, pending] = useActionState(
    async (prethodno: StanjeForme, formData: FormData) => {
      const r = await sacuvajProdaju(prethodno, formData);
      if (r.ok) {
        setRedovi([{ ...prazanRed }]);
        setVerzija((v) => v + 1);
      }
      return r;
    },
    { ok: false } as StanjeForme,
  );

  const proizvodMap = new Map(proizvodi.map((p) => [p.vrednost, p]));
  const lotMap = new Map(lotovi.map((l) => [l.vrednost, l]));

  let ukupnoCist = 0;
  let ukupnoIznos = 0;
  for (const r of redovi) {
    const p = proizvodMap.get(r.proizvodId);
    const boca = Number((r.boca || "").replace(",", "."));
    if (p && !Number.isNaN(boca) && boca > 0) {
      const jac = r.destilatId ? Number(lotMap.get(r.destilatId)?.jacina ?? p.jacina) : Number(p.jacina);
      ukupnoCist += boca * Number(p.zapreminaL) * (jac / 100);
      const cena = Number((r.cena || "").replace(",", "."));
      if (!Number.isNaN(cena) && cena > 0) ukupnoIznos += boca * cena;
    }
  }
  const ukupnoAkciza = ukupnoCist * stopa;

  const azuriraj = (i: number, polje: keyof Red, v: string) =>
    setRedovi((prev) => prev.map((r, idx) => (idx === i ? { ...r, [polje]: v } : r)));

  return (
    <form key={verzija} action={formAction} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{sr.prodajaUI.broj}</label>
          <input name="broj" className={inputKlase} placeholder="npr. 8/2026" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{sr.prodajaUI.kupac}</label>
          <select name="kupacId" defaultValue="" className={inputKlase}>
            <option value="">{sr.prodajaUI.izaberiKupca}</option>
            {kupci.map((k) => (
              <option key={k.vrednost} value={k.vrednost}>
                {k.labela}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            {sr.polja.datum}
            <span className="text-red-500"> *</span>
          </label>
          <input type="date" name="datum" className={inputKlase} />
          {stanje.greske?.datum ? <p className="mt-1 text-xs text-red-600">{stanje.greske.datum}</p> : null}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">{sr.prodajaUI.stavke}</span>
          <Dugme type="button" varijanta="sporedno" velicina="sm" onClick={() => setRedovi((p) => [...p, { ...prazanRed }])}>
            <Plus className="h-4 w-4" />
            {sr.prodajaUI.dodajStavku}
          </Dugme>
        </div>
        <div className="space-y-2">
          {redovi.map((r, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_80px_90px_auto] gap-2">
              <select
                name="stavkaProizvodId"
                value={r.proizvodId}
                onChange={(e) => azuriraj(i, "proizvodId", e.target.value)}
                className={inputKlase}
              >
                <option value="">{sr.prodajaUI.izaberiProizvod}</option>
                {proizvodi.map((p) => (
                  <option key={p.vrednost} value={p.vrednost}>
                    {p.labela}
                  </option>
                ))}
              </select>
              <select
                name="stavkaDestilatId"
                value={r.destilatId}
                onChange={(e) => azuriraj(i, "destilatId", e.target.value)}
                className={inputKlase}
              >
                <option value="">{sr.prodajaUI.izaberiLot}</option>
                {lotovi.map((l) => (
                  <option key={l.vrednost} value={l.vrednost}>
                    {l.labela}
                  </option>
                ))}
              </select>
              <input
                name="stavkaBoca"
                value={r.boca}
                onChange={(e) => azuriraj(i, "boca", e.target.value)}
                inputMode="numeric"
                placeholder={sr.prodajaUI.brojBoca}
                className={inputKlase}
              />
              <input
                name="stavkaCena"
                value={r.cena}
                onChange={(e) => azuriraj(i, "cena", e.target.value)}
                inputMode="decimal"
                placeholder={sr.prodajaUI.cena}
                className={inputKlase}
              />
              <Dugme
                type="button"
                varijanta="opasno"
                velicina="ikona"
                onClick={() => setRedovi((p) => (p.length > 1 ? p.filter((_, idx) => idx !== i) : p))}
                aria-label={sr.akcije.obrisi}
              >
                <Trash2 className="h-4 w-4" />
              </Dugme>
            </div>
          ))}
        </div>
        {stanje.greske?.stavke ? <p className="mt-1 text-xs text-red-600">{stanje.greske.stavke}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg bg-amber-50 px-4 py-3 text-sm">
        <span className="text-neutral-600">
          {sr.prodajaUI.ukupnoCist}: <strong className="text-neutral-900">{litara(ukupnoCist)}</strong>
        </span>
        <span className="text-neutral-600">
          {sr.prodajaUI.ukupnoAkciza}: <strong className="text-neutral-900">{dinar(ukupnoAkciza)}</strong>
        </span>
        <span className="text-neutral-600">
          {sr.prodajaUI.ukupnoIznos}: <strong className="text-neutral-900">{dinar(ukupnoIznos)}</strong>
        </span>
      </div>

      {stanje.poruka ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{stanje.poruka}</p>
      ) : null}

      <div className="flex justify-end">
        <Dugme type="submit" disabled={pending}>
          {pending ? sr.stanje.ucitavanje : sr.akcije.sacuvaj}
        </Dugme>
      </div>
    </form>
  );
}
