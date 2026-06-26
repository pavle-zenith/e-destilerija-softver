/**
 * Domenska logika za obračun akcize prema srpskom sistemu.
 *
 * Pravila:
 *  - Akciza se plaća po litru ČISTOG (apsolutnog) alkohola.
 *  - Obračunski period je polumesečni: deo 1 = 1.–15., deo 2 = 16.–kraj meseca.
 *  - Rok plaćanja je N dana posle kraja perioda (podesivo; podrazumevano 15).
 *
 * Sve funkcije su čiste (bez baze) radi lake provere i testiranja.
 */

/** Zapremina čistog alkohola: L * (%vol / 100). */
export function cistAlkoholL(kolicinaL: number, jacinaVol: number): number {
  return kolicinaL * (jacinaVol / 100);
}

/** Iznos akcize = litara čistog alkohola * stopa (RSD/L). */
export function obracunajAkcizu(litaraCistog: number, stopaRsdPoLitru: number): number {
  return litaraCistog * stopaRsdPoLitru;
}

/** Deo meseca za dati datum: 1 (1.–15.) ili 2 (16.–kraj). */
export function deoMeseca(d: Date): 1 | 2 {
  return d.getDate() <= 15 ? 1 : 2;
}

export interface Period {
  godina: number;
  /** 1–12 */
  mesec: number;
  deo: 1 | 2;
  /** Prvi dan perioda (UTC ponoć). */
  od: Date;
  /** Poslednji dan perioda (UTC ponoć). */
  do: Date;
}

/** Granice obračunskog perioda za zadatu godinu/mesec/deo. */
export function granicePerioda(godina: number, mesec: number, deo: 1 | 2): Period {
  const od = new Date(Date.UTC(godina, mesec - 1, deo === 1 ? 1 : 16));
  // Poslednji dan meseca: dan 0 sledećeg meseca.
  const krajMeseca = new Date(Date.UTC(godina, mesec, 0)).getUTCDate();
  const doDan = deo === 1 ? 15 : krajMeseca;
  const doDatum = new Date(Date.UTC(godina, mesec - 1, doDan));
  return { godina, mesec, deo, od, do: doDatum };
}

/** Period kome dati datum pripada. */
export function periodZaDatum(d: Date): Period {
  return granicePerioda(d.getUTCFullYear(), d.getUTCMonth() + 1, deoMeseca(d));
}

/** Rok plaćanja: kraj perioda + rokDana dana. */
export function rokPlacanja(periodDo: Date, rokDana = 15): Date {
  const rok = new Date(periodDo);
  rok.setUTCDate(rok.getUTCDate() + rokDana);
  return rok;
}

/**
 * Rok plaćanja po praksi (prema zvaničnoj evidenciji):
 *  - deo 1 (1.–15.) → poslednji dan istog meseca,
 *  - deo 2 (16.–kraj) → 15. sledećeg meseca.
 */
export function rokPolumesecni(p: Period): Date {
  if (p.deo === 1) {
    // Dan 0 sledećeg meseca = poslednji dan tekućeg meseca.
    return new Date(Date.UTC(p.godina, p.mesec, 0));
  }
  // 15. sledećeg meseca (mesec je 1-baziran, pa je `mesec` indeks sledećeg).
  return new Date(Date.UTC(p.godina, p.mesec, 15));
}

/** Da li je rok prošao u odnosu na referentni datum (podrazumevano danas). */
export function rokIstekao(rok: Date, danas: Date): boolean {
  return rok.getTime() < danas.getTime();
}
