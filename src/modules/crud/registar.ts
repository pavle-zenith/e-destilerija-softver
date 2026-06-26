/**
 * Server-only mapiranje ključeva entiteta na Drizzle tabele,
 * izvore FK opcija i funkcije za izračunata polja.
 * Ovde žive svi importi baze — ne sme se uvoziti u klijentske komponente.
 */
import "server-only";
import {
  proizvodi,
  kupci,
  dobavljaci,
  vrsteRakije,
  enoloskaSredstva,
  akcizaStopa,
} from "@/db/schema/sifarnici";
import { sirovine, proizvodnePartije, destilati } from "@/db/schema/proizvodnja";
import { sudovi } from "@/db/schema/magacin";
import { generisiQrKod } from "@/lib/qr";

type Tabela =
  | typeof proizvodi
  | typeof kupci
  | typeof dobavljaci
  | typeof vrsteRakije
  | typeof enoloskaSredstva
  | typeof akcizaStopa
  | typeof sirovine
  | typeof proizvodnePartije
  | typeof destilati
  | typeof sudovi;

export const TABELE: Record<string, Tabela> = {
  proizvodi,
  kupci,
  dobavljaci,
  "vrste-rakije": vrsteRakije,
  sredstva: enoloskaSredstva,
  "akcizna-stopa": akcizaStopa,
  sirovine,
  partije: proizvodnePartije,
  destilati,
  sudovi,
};

/**
 * Izvori FK opcija: ključ liste → tabela + kolona za labelu.
 * Vrednost opcije je uvek `id`.
 */
export const IZVORI_OPCIJA = {
  vrsteRakije: { tabela: vrsteRakije, labela: "naziv" as const },
  dobavljaci: { tabela: dobavljaci, labela: "naziv" as const },
  sirovine: { tabela: sirovine, labela: "naziv" as const },
  partije: { tabela: proizvodnePartije, labela: "oznaka" as const },
  destilati: { tabela: destilati, labela: "oznaka" as const },
};

export type OpcijeKljuc = keyof typeof IZVORI_OPCIJA;

/**
 * Izračunata polja koja se ne unose u formi nego se izvode iz unetih vrednosti.
 * `jeNov` razlikuje kreiranje od izmene (npr. QR kod se generiše samo jednom).
 */
export const IZRACUNAJ: Record<
  string,
  (vrednosti: Record<string, unknown>, jeNov: boolean) => Record<string, unknown>
> = {
  destilati: (v) => {
    const kol = Number(v.kolicinaL);
    const jac = Number(v.jacina);
    if (Number.isNaN(kol) || Number.isNaN(jac)) return {};
    // Čist (apsolutni) alkohol u litrima = L × %vol / 100.
    return { cistAlkoholL: ((kol * jac) / 100).toFixed(3) };
  },
  sudovi: (v, jeNov) => {
    if (!jeNov) return {}; // QR kod ostaje isti pri izmeni
    const prefiks = String(v.tip ?? "SUD").toUpperCase();
    return { qrKod: generisiQrKod(prefiks) };
  },
};
