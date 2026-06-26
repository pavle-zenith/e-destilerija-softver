/**
 * Server upiti za CRUD entitete: lista i FK opcije.
 */
import "server-only";
import { asc, desc } from "drizzle-orm";
import { db } from "@/db";
import { ENTITETI } from "./entiteti";
import type { Opcije, Stavka } from "./tipovi";
import { TABELE, IZVORI_OPCIJA, type OpcijeKljuc } from "./registar";

/** Učitava sve redove entiteta, sortirane po definisanom poretku. */
export async function ucitajListu(kljuc: string): Promise<Stavka[]> {
  const tabela = TABELE[kljuc];
  const { kolona, smer } = ENTITETI[kljuc].poredak;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const kol = (tabela as any)[kolona];
  const redovi = await db
    .select()
    .from(tabela)
    .orderBy(smer === "desc" ? desc(kol) : asc(kol));
  return redovi as Stavka[];
}

/** Učitava liste FK opcija potrebne za `izbor` polja datog entiteta. */
export async function ucitajOpcije(kljuc: string): Promise<Opcije> {
  const opcije: Opcije = {};
  const izborPolja = ENTITETI[kljuc].polja.filter((p) => p.tip === "izbor" && p.opcije);

  for (const polje of izborPolja) {
    const izvorKljuc = polje.opcije as OpcijeKljuc;
    const izvor = IZVORI_OPCIJA[izvorKljuc];
    if (!izvor) continue;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labelaKol = (izvor.tabela as any)[izvor.labela];
    const redovi = await db
      .select({ id: izvor.tabela.id, labela: labelaKol })
      .from(izvor.tabela)
      .orderBy(asc(labelaKol));
    opcije[polje.opcije as string] = redovi.map((r) => ({
      vrednost: r.id as string,
      labela: (r.labela as string) ?? "",
    }));
  }

  return opcije;
}
