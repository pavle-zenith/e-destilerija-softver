/**
 * Tipovi i sklapanje lanca sledljivosti:
 *   sirovina → partija → destilat → (egalizacija) → punjenje → sud → prodaja
 *
 * Sklapanje (`sastaviLanac`) je čista funkcija nad već dohvaćenim redovima iz baze,
 * tako da se DB upiti drže odvojeno od logike prikaza.
 */

export type KorakTip =
  | "sirovina"
  | "partija"
  | "destilat"
  | "egalizacija"
  | "punjenje"
  | "sud"
  | "prodaja";

export interface KorakLanca {
  tip: KorakTip;
  naslov: string;
  /** Slobodni opisni redovi (npr. "Količina: 120 L", "Jačina: 40%"). */
  detalji: string[];
  datum?: string | null;
  /** ID izvornog zapisa radi navigacije. */
  referencaId?: string;
}

export interface Lanac {
  /** QR kod ili oznaka polazne tačke. */
  oznaka: string;
  koraci: KorakLanca[];
}

/** Sastavlja uređeni lanac od pojedinačnih koraka (filtrira prazne). */
export function sastaviLanac(oznaka: string, koraci: (KorakLanca | null | undefined)[]): Lanac {
  return {
    oznaka,
    koraci: koraci.filter((k): k is KorakLanca => Boolean(k)),
  };
}
