import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { broj, litara, procenat } from "@/i18n/format";
import {
  ucitajStanjeProizvoda,
  ucitajStanjeSudova,
  type StatusZaliha,
} from "@/modules/magacin/stanje";

export const dynamic = "force-dynamic";

const STATUS_STIL: Record<StatusZaliha, string> = {
  dovoljno: "bg-green-50 text-green-700",
  nisko: "bg-amber-100 text-amber-800",
  nema: "bg-red-100 text-red-700",
};
const STATUS_LABELA: Record<StatusZaliha, string> = {
  dovoljno: sr.magacin.dovoljno,
  nisko: sr.stanje.niskeZalihe,
  nema: sr.magacin.nemaNaStanju,
};

export default async function MagacinStranica() {
  const [proizvodi, sudovi] = await Promise.all([ucitajStanjeProizvoda(), ucitajStanjeSudova()]);
  const upozorenja = proizvodi.filter((p) => p.status !== "dovoljno").length;

  return (
    <div>
      <PageHeader
        naslov={sr.nav.magacin}
        opis={sr.magacin.opis}
        akcija={
          upozorenja > 0 ? (
            <span className="inline-flex items-center gap-2 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-800">
              <AlertTriangle className="h-4 w-4" />
              {upozorenja} {sr.stanje.niskeZalihe.toLowerCase()}
            </span>
          ) : null
        }
      />

      {/* Gotovi proizvodi (boce) */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {sr.magacin.boce}
      </h2>
      <div className="mb-8 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        {proizvodi.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-400">{sr.magacin.bezProizvoda}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-medium">{sr.polja.naziv}</th>
                <th className="px-4 py-3 font-medium">{sr.polja.jacina}</th>
                <th className="px-4 py-3 font-medium">{sr.magacin.naStanju}</th>
                <th className="px-4 py-3 font-medium">{sr.magacin.prag}</th>
                <th className="px-4 py-3 font-medium">{sr.magacin.status}</th>
              </tr>
            </thead>
            <tbody>
              {proizvodi.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-800">{p.naziv}</td>
                  <td className="px-4 py-3 text-neutral-600">{procenat(p.jacina)}</td>
                  <td className="px-4 py-3 text-neutral-700">
                    {broj(p.stanje, 0)} {sr.magacin.komada}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{p.prag != null ? broj(p.prag, 0) : "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STIL[p.status]}`}>
                      {STATUS_LABELA[p.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Rinfuz (sudovi) */}
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-neutral-500">
        {sr.magacin.rinfuz}
      </h2>
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        {sudovi.length === 0 ? (
          <p className="px-4 py-12 text-center text-sm text-neutral-400">{sr.magacin.bezSudova}</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
                <th className="px-4 py-3 font-medium">{sr.polja.oznaka}</th>
                <th className="px-4 py-3 font-medium">{sr.polja.tipSuda}</th>
                <th className="px-4 py-3 font-medium">{sr.magacin.naStanju}</th>
                <th className="px-4 py-3 font-medium">{sr.magacin.kapacitet}</th>
                <th className="px-4 py-3 font-medium">{sr.magacin.popunjenost}</th>
                <th className="px-4 py-3 font-medium">{sr.polja.lokacija}</th>
              </tr>
            </thead>
            <tbody>
              {sudovi.map((s) => (
                <tr key={s.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-800">{s.oznaka}</td>
                  <td className="px-4 py-3 text-neutral-600">{sr.tipSuda[s.tip as keyof typeof sr.tipSuda]}</td>
                  <td className="px-4 py-3 text-neutral-700">{litara(s.trenutnaKolicinaL)}</td>
                  <td className="px-4 py-3 text-neutral-500">{s.kapacitetL ? litara(s.kapacitetL) : "—"}</td>
                  <td className="px-4 py-3">
                    {s.popunjenost != null ? (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-200">
                          <div className="h-full rounded-full bg-amber-500" style={{ width: `${s.popunjenost * 100}%` }} />
                        </div>
                        <span className="text-xs text-neutral-500">{procenat(s.popunjenost * 100)}</span>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{s.lokacija ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
