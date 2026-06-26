"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { sr } from "@/i18n/sr";
import { broj, datum } from "@/i18n/format";
import { Dugme } from "@/components/ui/dugme";
import { EntitetForma } from "./forma";
import { obrisi } from "./akcije";
import type { EntitetMeta, Opcije, Polje, Stavka } from "./tipovi";

interface TabelaProps {
  meta: EntitetMeta;
  opcije: Opcije;
  podaci: Stavka[];
}

/** Formatira vrednost ćelije prema tipu polja. */
function prikazCelije(polje: Polje, vrednost: unknown, opcije: Opcije): string {
  if (vrednost == null || vrednost === "") return "—";
  switch (polje.tip) {
    case "boolean":
      return vrednost ? sr.forma.da : sr.forma.ne;
    case "broj":
      return broj(vrednost as string, polje.decimala ?? 2);
    case "ceo":
      return broj(vrednost as number, 0);
    case "datum":
      return datum(vrednost as string);
    case "izbor": {
      const lista = polje.opcijeStatic ?? (polje.opcije ? opcije[polje.opcije] : undefined) ?? [];
      return lista.find((o) => o.vrednost === vrednost)?.labela ?? "—";
    }
    default:
      return String(vrednost);
  }
}

export function EntitetTabela({ meta, opcije, podaci }: TabelaProps) {
  const [modalOtvoren, setModalOtvoren] = useState(false);
  const [stavkaZaIzmenu, setStavkaZaIzmenu] = useState<Stavka | null>(null);
  const [brisem, startBrisanje] = useTransition();

  const kolone = meta.polja.filter((p) => p.uTabeli !== false);

  function otvoriNovi() {
    setStavkaZaIzmenu(null);
    setModalOtvoren(true);
  }

  function otvoriIzmenu(stavka: Stavka) {
    setStavkaZaIzmenu(stavka);
    setModalOtvoren(true);
  }

  function zatvori() {
    setModalOtvoren(false);
    setStavkaZaIzmenu(null);
  }

  function obrisiStavku(id: string) {
    if (!window.confirm(sr.forma.potvrdaBrisanja)) return;
    startBrisanje(async () => {
      await obrisi(meta.kljuc, id);
    });
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dugme onClick={otvoriNovi}>
          <Plus className="h-4 w-4" />
          {meta.dodaj}
        </Dugme>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        {podaci.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-400">{sr.forma.nemaUnosa}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
                {kolone.map((p) => (
                  <th key={p.ime} className="px-4 py-3 font-medium">
                    {p.labela}
                  </th>
                ))}
                <th className="w-24 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {podaci.map((red) => (
                <tr key={red.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  {kolone.map((p) => (
                    <td key={p.ime} className="px-4 py-3 text-neutral-700">
                      {prikazCelije(p, red[p.ime], opcije)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Dugme
                        varijanta="tiho"
                        velicina="ikona"
                        onClick={() => otvoriIzmenu(red)}
                        aria-label={sr.akcije.izmeni}
                        title={sr.akcije.izmeni}
                      >
                        <Pencil className="h-4 w-4" />
                      </Dugme>
                      <Dugme
                        varijanta="opasno"
                        velicina="ikona"
                        onClick={() => obrisiStavku(red.id)}
                        disabled={brisem}
                        aria-label={sr.akcije.obrisi}
                        title={sr.akcije.obrisi}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Dugme>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOtvoren ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center"
          onClick={zatvori}
        >
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-neutral-900">
                {stavkaZaIzmenu ? sr.akcije.izmeni : meta.dodaj}
              </h2>
              <Dugme varijanta="tiho" velicina="ikona" onClick={zatvori} aria-label={sr.akcije.otkazi}>
                <X className="h-4 w-4" />
              </Dugme>
            </div>
            <EntitetForma
              key={stavkaZaIzmenu?.id ?? "novi"}
              meta={meta}
              opcije={opcije}
              stavka={stavkaZaIzmenu}
              onUspeh={zatvori}
              onOtkazi={zatvori}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
