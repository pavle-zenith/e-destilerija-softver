/**
 * Generički CRUD engine — tipovi polja i zod validacija.
 *
 * Klijentski-bezbedno (bez baze): koriste ga forma, tabela i server akcije.
 * Drizzle tabele su odvojene u `registar.ts` (samo server).
 */
import { z } from "zod";
import { sr } from "@/i18n/sr";

export type TipPolja =
  | "tekst"
  | "textarea"
  | "broj" // numeric (decimalni) — u bazi se čuva kao string
  | "ceo" // integer
  | "boolean"
  | "datum"
  | "izbor"; // strani ključ ili enum — vrednost je string

export interface Polje {
  /** Ime kolone (camelCase, poklapa se sa Drizzle šemom). */
  ime: string;
  labela: string;
  tip: TipPolja;
  obavezno?: boolean;
  /** Broj decimala za `broj` (skala numeric kolone). */
  decimala?: number;
  /** Ključ liste opcija za `izbor` (FK — učitava se na serveru, vidi podaci.ts). */
  opcije?: string;
  /** Statične opcije za `izbor` (enum) — ne učitavaju se iz baze. */
  opcijeStatic?: Opcija[];
  /** Podrazumevana vrednost (npr. za boolean ili enum). */
  podrazumevano?: string | boolean;
  /** Prikazati u tabeli (lista). Podrazumevano true. */
  uTabeli?: boolean;
}

export interface EntitetMeta {
  /** Ključ — koristi se u ruti i registru. */
  kljuc: string;
  /** Bazna putanja sekcije, npr. "/sifarnici" ili "/proizvodnja". */
  osnovnaPutanja: string;
  /** Naslov (množina). */
  mn: string;
  /** Tekst dugmeta za dodavanje. */
  dodaj: string;
  /** Opis za karticu i zaglavlje. */
  opis: string;
  polja: Polje[];
  /** Kolona po kojoj se sortira lista + smer. */
  poredak: { kolona: string; smer: "asc" | "desc" };
}

/** Tip jednog reda iz baze (id + dinamička polja). */
export type Stavka = { id: string } & Record<string, unknown>;

/** Opcija za `izbor` polje: vrednost (id/enum) + labela za prikaz. */
export type Opcija = { vrednost: string; labela: string };
/** Mapa FK opcija: ključ liste → opcije. */
export type Opcije = Record<string, Opcija[]>;

/** Stanje koje server akcija vraća formi (useActionState). */
export type StanjeForme = {
  ok: boolean;
  /** Greške po polju: ime polja → poruka. */
  greske?: Record<string, string>;
  /** Opšta poruka (npr. greška baze). */
  poruka?: string;
};

/**
 * Gradi zod šemu za validaciju iz metapodataka polja.
 * Vrednosti stižu iz FormData (string ili odsutne).
 * Decimalna polja ostaju string (Drizzle numeric očekuje string).
 */
export function zodZaEntitet(meta: EntitetMeta) {
  const oblik: Record<string, z.ZodTypeAny> = {};

  for (const polje of meta.polja) {
    let s: z.ZodTypeAny;

    switch (polje.tip) {
      case "boolean":
        s = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());
        break;
      case "ceo":
        s = z.coerce.number({ message: sr.forma.neispravanBroj }).int();
        if (!polje.obavezno) s = praznoUNull(s);
        break;
      case "broj": {
        const broj = z
          .string()
          .trim()
          .refine((v) => v !== "" && !Number.isNaN(Number(v.replace(",", "."))), {
            message: sr.forma.neispravanBroj,
          })
          .transform((v) => v.replace(",", "."));
        s = polje.obavezno ? broj : praznoUNull(broj);
        break;
      }
      case "datum": {
        const datum = z
          .string()
          .trim()
          .refine((v) => v !== "" && !Number.isNaN(new Date(v).getTime()), {
            message: sr.forma.neispravanDatum,
          });
        s = polje.obavezno ? datum : praznoUNull(datum);
        break;
      }
      case "izbor": {
        const izbor = z.string().trim();
        s = polje.obavezno ? izbor.min(1, { message: sr.forma.obavezno }) : praznoUNull(izbor);
        break;
      }
      default: {
        const tekst = z.string().trim();
        s = polje.obavezno ? tekst.min(1, { message: sr.forma.obavezno }) : praznoUNull(tekst);
      }
    }

    oblik[polje.ime] = s;
  }

  return z.object(oblik);
}

/** Prazan string → null (za neobavezna polja). */
function praznoUNull(s: z.ZodTypeAny) {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    s.nullable(),
  );
}
