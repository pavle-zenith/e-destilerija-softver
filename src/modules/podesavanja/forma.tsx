"use client";

import { useActionState } from "react";
import { sr } from "@/i18n/sr";
import { Dugme } from "@/components/ui/dugme";
import { sacuvajPodesavanja } from "./akcije";

/** Trenutne vrednosti (string | number | null iz baze). */
export interface PodesavanjaVrednosti {
  nazivFirme: string | null;
  pib: string | null;
  maticniBroj: string | null;
  adresa: string | null;
  akcizaRokDana: number;
  podsetnikDana: number;
}

const inputKlase =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

const { polja: P } = sr;

export function PodesavanjaForma({ vrednosti }: { vrednosti: PodesavanjaVrednosti }) {
  const [stanje, formAction, pending] = useActionState(sacuvajPodesavanja, { ok: false });

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Podaci o firmi
        </h2>
        <div className="space-y-4">
          <Tekst ime="nazivFirme" labela={P.nazivFirme} pocetna={vrednosti.nazivFirme} greska={stanje.greske?.nazivFirme} />
          <Tekst ime="pib" labela={P.pib} pocetna={vrednosti.pib} greska={stanje.greske?.pib} />
          <Tekst ime="maticniBroj" labela={P.maticniBroj} pocetna={vrednosti.maticniBroj} greska={stanje.greske?.maticniBroj} />
          <Tekst ime="adresa" labela={P.adresa} pocetna={vrednosti.adresa} greska={stanje.greske?.adresa} />
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {sr.nav.akcize}
        </h2>
        <div className="space-y-4">
          <Tekst ime="akcizaRokDana" labela={P.akcizaRokDana} tip="number" pocetna={String(vrednosti.akcizaRokDana)} greska={stanje.greske?.akcizaRokDana} />
          <Tekst ime="podsetnikDana" labela={P.podsetnikDana} tip="number" pocetna={String(vrednosti.podsetnikDana)} greska={stanje.greske?.podsetnikDana} />
        </div>
      </section>

      <div className="flex items-center gap-3">
        <Dugme type="submit" disabled={pending}>
          {pending ? sr.stanje.ucitavanje : sr.akcije.sacuvaj}
        </Dugme>
        {stanje.ok && stanje.poruka ? (
          <span className="text-sm text-green-700">{stanje.poruka}</span>
        ) : null}
        {!stanje.ok && stanje.poruka ? (
          <span className="text-sm text-red-700">{stanje.poruka}</span>
        ) : null}
      </div>
    </form>
  );
}

function Tekst({
  ime,
  labela,
  pocetna,
  greska,
  tip = "text",
}: {
  ime: string;
  labela: string;
  pocetna: string | null;
  greska?: string;
  tip?: "text" | "number";
}) {
  const id = `pod-${ime}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-neutral-700">
        {labela}
      </label>
      <input
        id={id}
        type={tip}
        name={ime}
        defaultValue={pocetna ?? ""}
        min={tip === "number" ? 0 : undefined}
        className={inputKlase}
      />
      {greska ? <p className="mt-1 text-xs text-red-600">{greska}</p> : null}
    </div>
  );
}
