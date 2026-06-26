/**
 * Server upiti za šifarnike: učitavanje liste i FK opcija.
 */
import "server-only";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { RESURSI, type ResursKljuc, type Opcije, type Stavka } from "./polja";
import { TABELE, IZVORI_OPCIJA } from "./registar";

/** Učitava sve redove resursa, sortirane po definisanom poretku. */
export async function ucitajListu(kljuc: ResursKljuc): Promise<Stavka[]> {
  const tabela = TABELE[kljuc];
  const { kolona, smer } = RESURSI[kljuc].poredak;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kol = (tabela as any)[kolona];
  const redovi = await db
    .select()
    .from(tabela)
    .orderBy(smer === "desc" ? desc(kol) : asc(kol));
  return redovi as Stavka[];
}

/**
 * Učitava liste opcija potrebne za `izbor` polja datog resursa.
 * Vraća mapu: ključ liste (npr. "vrsteRakije") → [{ vrednost, labela }].
 */
export async function ucitajOpcije(kljuc: ResursKljuc): Promise<Opcije> {
  const opcije: Opcije = {};
  const izborPolja = RESURSI[kljuc].polja.filter((p) => p.tip === "izbor" && p.opcije);

  for (const polje of izborPolja) {
    const izvorKljuc = polje.opcije as keyof typeof IZVORI_OPCIJA;
    const izvor = IZVORI_OPCIJA[izvorKljuc];
    if (!izvor) continue;
    const redovi = await db.select({ id: izvor.id, naziv: izvor.naziv }).from(izvor).orderBy(asc(izvor.naziv));
    opcije[polje.opcije as string] = redovi.map((r) => ({ vrednost: r.id, labela: r.naziv }));
  }

  return opcije;
}
