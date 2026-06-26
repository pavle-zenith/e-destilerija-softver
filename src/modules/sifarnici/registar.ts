/**
 * Server-only mapiranje ključeva resursa na Drizzle tabele.
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
} from "@/db/schema";
import type { ResursKljuc } from "./polja";

/** Bilo koja Drizzle pg tabela iz šifarnika. */
type Tabela =
  | typeof proizvodi
  | typeof kupci
  | typeof dobavljaci
  | typeof vrsteRakije
  | typeof enoloskaSredstva
  | typeof akcizaStopa;

export const TABELE: Record<ResursKljuc, Tabela> = {
  proizvodi,
  kupci,
  dobavljaci,
  "vrste-rakije": vrsteRakije,
  sredstva: enoloskaSredstva,
  "akcizna-stopa": akcizaStopa,
};

/**
 * Izvori opcija za `izbor` (FK) polja: ključ liste → tabela sa { id, naziv }.
 * Trenutno samo vrste rakije (za proizvode).
 */
export const IZVORI_OPCIJA = {
  vrsteRakije,
} as const;

export type OpcijeKljuc = keyof typeof IZVORI_OPCIJA;
