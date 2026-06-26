"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { sr } from "@/i18n/sr";
import { litara, procenat } from "@/i18n/format";
import { Dugme } from "@/components/ui/dugme";
import type { StanjeForme } from "@/modules/crud/tipovi";
import { sacuvajEgalizaciju } from "./egalizacija-akcije";

export interface DestilatOpcija {
  id: string;
  oznaka: string;
  jacina: string | null;
}
export interface Opcija {
  vrednost: string;
  labela: string;
}

const inputKlase =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

interface Red {
  destilatId: string;
  kolicinaL: string;
}

export function EgalizacijaForma({
  destilati,
  vrsteRakije,
}: {
  destilati: DestilatOpcija[];
  vrsteRakije: Opcija[];
}) {
  const [redovi, setRedovi] = useState<Red[]>([{ destilatId: "", kolicinaL: "" }]);
  const [verzija, setVerzija] = useState(0); // reset forme posle uspeha

  // Reset radimo u akciji (na klijentu) posle uspeha — ne u efektu.
  const [stanje, formAction, pending] = useActionState(
    async (prethodno: StanjeForme, formData: FormData) => {
      const r = await sacuvajEgalizaciju(prethodno, formData);
      if (r.ok) {
        setRedovi([{ destilatId: "", kolicinaL: "" }]);
        setVerzija((v) => v + 1);
      }
      return r;
    },
    { ok: false } as StanjeForme,
  );

  const jacinaPoId = new Map(destilati.map((d) => [d.id, Number(d.jacina ?? 0)]));
  let ukupnoL = 0;
  let ukupnoCist = 0;
  for (const r of redovi) {
    const L = Number((r.kolicinaL || "").replace(",", "."));
    if (!Number.isNaN(L) && L > 0) {
      ukupnoL += L;
      ukupnoCist += (L * (jacinaPoId.get(r.destilatId) ?? 0)) / 100;
    }
  }
  const jacinaRez = ukupnoL > 0 ? (ukupnoCist / ukupnoL) * 100 : 0;

  function azuriraj(i: number, polje: keyof Red, vrednost: string) {
    setRedovi((prev) => prev.map((r, idx) => (idx === i ? { ...r, [polje]: vrednost } : r)));
  }
  function dodajRed() {
    setRedovi((prev) => [...prev, { destilatId: "", kolicinaL: "" }]);
  }
  function ukloniRed(i: number) {
    setRedovi((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));
  }

  return (
    <form key={verzija} action={formAction} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            {sr.egalizacija.oznakaPolja}
            <span className="text-red-500"> *</span>
          </label>
          <input name="oznaka" className={inputKlase} />
          {stanje.greske?.oznaka ? <p className="mt-1 text-xs text-red-600">{stanje.greske.oznaka}</p> : null}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{sr.polja.datum}</label>
          <input type="date" name="datum" className={inputKlase} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{sr.polja.vrstaRakije}</label>
          <select name="vrstaRakijeId" className={inputKlase} defaultValue="">
            <option value="">{sr.forma.odaberi}</option>
            {vrsteRakije.map((o) => (
              <option key={o.vrednost} value={o.vrednost}>
                {o.labela}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{sr.polja.napomena}</label>
          <input name="napomena" className={inputKlase} />
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-neutral-700">{sr.egalizacija.ulazi}</span>
          <Dugme type="button" varijanta="sporedno" velicina="sm" onClick={dodajRed}>
            <Plus className="h-4 w-4" />
            {sr.egalizacija.dodajUlaz}
          </Dugme>
        </div>
        <div className="space-y-2">
          {redovi.map((r, i) => (
            <div key={i} className="flex gap-2">
              <select
                name="ulazDestilatId"
                value={r.destilatId}
                onChange={(e) => azuriraj(i, "destilatId", e.target.value)}
                className={inputKlase}
              >
                <option value="">{sr.egalizacija.izaberiDestilat}</option>
                {destilati.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.oznaka} ({procenat(d.jacina)})
                  </option>
                ))}
              </select>
              <input
                name="ulazKolicinaL"
                value={r.kolicinaL}
                onChange={(e) => azuriraj(i, "kolicinaL", e.target.value)}
                inputMode="decimal"
                placeholder="L"
                className="w-32 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Dugme
                type="button"
                varijanta="opasno"
                velicina="ikona"
                onClick={() => ukloniRed(i)}
                aria-label={sr.akcije.obrisi}
              >
                <Trash2 className="h-4 w-4" />
              </Dugme>
            </div>
          ))}
        </div>
        {stanje.greske?.ulazi ? <p className="mt-1 text-xs text-red-600">{stanje.greske.ulazi}</p> : null}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-lg bg-indigo-50 px-4 py-3 text-sm">
        <span className="text-neutral-600">
          {sr.egalizacija.ukupnoL}: <strong className="text-neutral-900">{litara(ukupnoL)}</strong>
        </span>
        <span className="text-neutral-600">
          {sr.egalizacija.procenjenaJacina}: <strong className="text-neutral-900">{procenat(jacinaRez)}</strong>
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
