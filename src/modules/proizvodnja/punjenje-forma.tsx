"use client";

import { useActionState, useState } from "react";
import { sr } from "@/i18n/sr";
import { litara } from "@/i18n/format";
import { Dugme } from "@/components/ui/dugme";
import type { StanjeForme } from "@/modules/crud/tipovi";
import { sacuvajPunjenje } from "./punjenje-akcije";

export interface Opcija {
  vrednost: string;
  labela: string;
}
export interface ProizvodOpcija extends Opcija {
  zapreminaL: string;
}

const inputKlase =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500";

export function PunjenjeForma({
  destilati,
  sudovi,
  proizvodi,
}: {
  destilati: Opcija[];
  sudovi: Opcija[];
  proizvodi: ProizvodOpcija[];
}) {
  const [nacin, setNacin] = useState<"sud" | "proizvod">("sud");
  const [proizvodId, setProizvodId] = useState("");
  const [brojBoca, setBrojBoca] = useState("");
  const [verzija, setVerzija] = useState(0);

  // Reset radimo u akciji (na klijentu) posle uspeha — ne u efektu.
  const [stanje, formAction, pending] = useActionState(
    async (prethodno: StanjeForme, formData: FormData) => {
      const r = await sacuvajPunjenje(prethodno, formData);
      if (r.ok) {
        setProizvodId("");
        setBrojBoca("");
        setVerzija((v) => v + 1);
      }
      return r;
    },
    { ok: false } as StanjeForme,
  );

  const zapremina = Number(proizvodi.find((p) => p.vrednost === proizvodId)?.zapreminaL ?? 0);
  const brojN = Number((brojBoca || "").replace(",", "."));
  const ukupnoL = !Number.isNaN(brojN) && brojN > 0 ? brojN * zapremina : 0;

  return (
    <form key={verzija} action={formAction} className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-5">
      <input type="hidden" name="nacin" value={nacin} />

      <div>
        <span className="mb-1 block text-sm font-medium text-neutral-700">{sr.punjenje.nacin}</span>
        <div className="flex gap-2">
          {(["sud", "proizvod"] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNacin(n)}
              className={
                "rounded-lg border px-4 py-2 text-sm font-medium transition-colors " +
                (nacin === n
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                  : "border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100")
              }
            >
              {n === "sud" ? sr.punjenje.uSud : sr.punjenje.uBoce}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          {sr.polja.destilat}
          <span className="text-red-500"> *</span>
        </label>
        <select name="destilatId" defaultValue="" className={inputKlase}>
          <option value="">{sr.punjenje.izaberiDestilat}</option>
          {destilati.map((d) => (
            <option key={d.vrednost} value={d.vrednost}>
              {d.labela}
            </option>
          ))}
        </select>
        {stanje.greske?.destilatId ? <p className="mt-1 text-xs text-red-600">{stanje.greske.destilatId}</p> : null}
      </div>

      {nacin === "sud" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              {sr.koraci.sud}
              <span className="text-red-500"> *</span>
            </label>
            <select name="sudId" defaultValue="" className={inputKlase}>
              <option value="">{sr.punjenje.izaberiSud}</option>
              {sudovi.map((s) => (
                <option key={s.vrednost} value={s.vrednost}>
                  {s.labela}
                </option>
              ))}
            </select>
            {stanje.greske?.sudId ? <p className="mt-1 text-xs text-red-600">{stanje.greske.sudId}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              {sr.polja.kolicinaL}
              <span className="text-red-500"> *</span>
            </label>
            <input name="kolicinaL" inputMode="decimal" className={inputKlase} />
            {stanje.greske?.kolicinaL ? <p className="mt-1 text-xs text-red-600">{stanje.greske.kolicinaL}</p> : null}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              {sr.pojmovi.proizvodi}
              <span className="text-red-500"> *</span>
            </label>
            <select
              name="proizvodId"
              value={proizvodId}
              onChange={(e) => setProizvodId(e.target.value)}
              className={inputKlase}
            >
              <option value="">{sr.punjenje.izaberiProizvod}</option>
              {proizvodi.map((p) => (
                <option key={p.vrednost} value={p.vrednost}>
                  {p.labela}
                </option>
              ))}
            </select>
            {stanje.greske?.proizvodId ? <p className="mt-1 text-xs text-red-600">{stanje.greske.proizvodId}</p> : null}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              {sr.punjenje.brojBoca}
              <span className="text-red-500"> *</span>
            </label>
            <input
              name="brojJedinica"
              value={brojBoca}
              onChange={(e) => setBrojBoca(e.target.value)}
              inputMode="numeric"
              className={inputKlase}
            />
            {stanje.greske?.brojJedinica ? (
              <p className="mt-1 text-xs text-red-600">{stanje.greske.brojJedinica}</p>
            ) : null}
            {ukupnoL > 0 ? <p className="mt-1 text-xs text-neutral-500">≈ {litara(ukupnoL)}</p> : null}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{sr.polja.datum}</label>
          <input type="date" name="datum" className={inputKlase} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">{sr.polja.napomena}</label>
          <input name="napomena" className={inputKlase} />
        </div>
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
