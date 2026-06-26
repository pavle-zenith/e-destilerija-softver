"use client";

import { useActionState, useEffect } from "react";
import { sr } from "@/i18n/sr";
import { Dugme } from "@/components/ui/dugme";
import { sacuvaj } from "./akcije";
import type { EntitetMeta, Opcije, Polje, Stavka } from "./tipovi";

interface FormaProps {
  meta: EntitetMeta;
  opcije: Opcije;
  /** Stavka koja se menja, ili null za novi unos. */
  stavka: Stavka | null;
  onUspeh: () => void;
  onOtkazi: () => void;
}

const inputKlase =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

function pocetnaVrednost(polje: Polje, stavka: Stavka | null): string {
  if (stavka && stavka[polje.ime] != null) {
    const v = stavka[polje.ime];
    if (polje.tip === "datum") return String(v).slice(0, 10);
    return String(v);
  }
  if (typeof polje.podrazumevano === "string") return polje.podrazumevano;
  return "";
}

export function EntitetForma({ meta, opcije, stavka, onUspeh, onOtkazi }: FormaProps) {
  const akcija = sacuvaj.bind(null, meta.kljuc);
  const [stanje, formAction, pending] = useActionState(akcija, { ok: false });

  useEffect(() => {
    if (stanje.ok) onUspeh();
  }, [stanje, onUspeh]);

  return (
    <form action={formAction} className="space-y-4">
      {stavka ? <input type="hidden" name="id" value={stavka.id} /> : null}

      {meta.polja.map((polje) => {
        const greska = stanje.greske?.[polje.ime];
        const idPolja = `polje-${polje.ime}`;
        return (
          <div key={polje.ime}>
            {polje.tip === "boolean" ? (
              <label htmlFor={idPolja} className="flex items-center gap-2 text-sm text-neutral-700">
                <input
                  id={idPolja}
                  type="checkbox"
                  name={polje.ime}
                  defaultChecked={stavka ? Boolean(stavka[polje.ime]) : Boolean(polje.podrazumevano)}
                  className="h-4 w-4 rounded border-neutral-300 text-amber-700 focus:ring-amber-500"
                />
                {polje.labela}
              </label>
            ) : (
              <>
                <label htmlFor={idPolja} className="mb-1 block text-sm font-medium text-neutral-700">
                  {polje.labela}
                  {polje.obavezno ? <span className="text-red-500"> *</span> : null}
                </label>
                <Polje id={idPolja} polje={polje} opcije={opcije} pocetna={pocetnaVrednost(polje, stavka)} />
              </>
            )}
            {greska ? <p className="mt-1 text-xs text-red-600">{greska}</p> : null}
          </div>
        );
      })}

      {stanje.poruka ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{stanje.poruka}</p>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <Dugme type="button" varijanta="sporedno" onClick={onOtkazi} disabled={pending}>
          {sr.akcije.odustani}
        </Dugme>
        <Dugme type="submit" disabled={pending}>
          {pending ? sr.stanje.ucitavanje : sr.akcije.sacuvaj}
        </Dugme>
      </div>
    </form>
  );
}

function Polje({
  id,
  polje,
  opcije,
  pocetna,
}: {
  id: string;
  polje: Polje;
  opcije: Opcije;
  pocetna: string;
}) {
  if (polje.tip === "textarea") {
    return <textarea id={id} name={polje.ime} defaultValue={pocetna} rows={3} className={inputKlase} />;
  }

  if (polje.tip === "izbor") {
    const lista = polje.opcijeStatic ?? (polje.opcije ? opcije[polje.opcije] : undefined) ?? [];
    return (
      <select id={id} name={polje.ime} defaultValue={pocetna} className={inputKlase}>
        <option value="">{sr.forma.odaberi}</option>
        {lista.map((o) => (
          <option key={o.vrednost} value={o.vrednost}>
            {o.labela}
          </option>
        ))}
      </select>
    );
  }

  const tipInputa = polje.tip === "datum" ? "date" : "text";
  return (
    <input
      id={id}
      type={tipInputa}
      name={polje.ime}
      defaultValue={pocetna}
      inputMode={polje.tip === "broj" || polje.tip === "ceo" ? "decimal" : undefined}
      className={inputKlase}
    />
  );
}
