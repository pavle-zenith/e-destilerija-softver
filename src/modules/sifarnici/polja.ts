/**
 * Registar šifarnika — metapodaci o poljima svakog resursa.
 *
 * Klijentski-bezbedan (bez drizzle/baze): koriste ga i forma i tabela na klijentu,
 * a server akcije iz njega grade zod validaciju. Drizzle tabele su odvojene
 * u `registar.ts` (samo server) da se server kod ne bi uvukao u klijentski bundle.
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
  | "izbor"; // strani ključ — vrednost je id povezane stavke

export interface Polje {
  /** Ime kolone (camelCase, poklapa se sa Drizzle šemom). */
  ime: string;
  labela: string;
  tip: TipPolja;
  obavezno?: boolean;
  /** Broj decimala za `broj` (skala numeric kolone). */
  decimala?: number;
  /** Ključ liste opcija za `izbor` (učitava se na serveru, vidi podaci.ts). */
  opcije?: string;
  /** Podrazumevana vrednost (npr. za boolean). */
  podrazumevano?: string | boolean;
  /** Prikazati u tabeli (lista). Podrazumevano true. */
  uTabeli?: boolean;
}

export type ResursKljuc =
  | "proizvodi"
  | "kupci"
  | "dobavljaci"
  | "vrste-rakije"
  | "sredstva"
  | "akcizna-stopa";

export interface ResursMeta {
  kljuc: ResursKljuc;
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

const { polja: P } = sr;

/** Standardna kontakt polja koja dele kupci i dobavljači. */
const kontaktPolja: Polje[] = [
  { ime: "naziv", labela: P.naziv, tip: "tekst", obavezno: true },
  { ime: "pib", labela: P.pib, tip: "tekst" },
  { ime: "maticniBroj", labela: P.maticniBroj, tip: "tekst", uTabeli: false },
  { ime: "adresa", labela: P.adresa, tip: "tekst", uTabeli: false },
  { ime: "telefon", labela: P.telefon, tip: "tekst" },
  { ime: "email", labela: P.email, tip: "tekst" },
  { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
];

export const RESURSI: Record<ResursKljuc, ResursMeta> = {
  proizvodi: {
    kljuc: "proizvodi",
    mn: sr.sifarnici.resursi.proizvodi.mn,
    dodaj: sr.sifarnici.resursi.proizvodi.dodaj,
    opis: sr.sifarnici.resursi.proizvodi.opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: [
      { ime: "naziv", labela: P.naziv, tip: "tekst", obavezno: true },
      { ime: "vrstaRakijeId", labela: P.vrstaRakije, tip: "izbor", opcije: "vrsteRakije" },
      { ime: "zapreminaL", labela: P.zapreminaL, tip: "broj", decimala: 3, obavezno: true },
      { ime: "jacina", labela: P.jacina, tip: "broj", decimala: 2, obavezno: true },
      { ime: "barkod", labela: P.barkod, tip: "tekst", uTabeli: false },
      { ime: "pragNiskihZaliha", labela: P.pragNiskihZaliha, tip: "broj", decimala: 3, uTabeli: false },
      { ime: "aktivan", labela: P.aktivan, tip: "boolean", podrazumevano: true },
    ],
  },
  kupci: {
    kljuc: "kupci",
    mn: sr.sifarnici.resursi.kupci.mn,
    dodaj: sr.sifarnici.resursi.kupci.dodaj,
    opis: sr.sifarnici.resursi.kupci.opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: kontaktPolja,
  },
  dobavljaci: {
    kljuc: "dobavljaci",
    mn: sr.sifarnici.resursi.dobavljaci.mn,
    dodaj: sr.sifarnici.resursi.dobavljaci.dodaj,
    opis: sr.sifarnici.resursi.dobavljaci.opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: kontaktPolja,
  },
  "vrste-rakije": {
    kljuc: "vrste-rakije",
    mn: sr.sifarnici.resursi["vrste-rakije"].mn,
    dodaj: sr.sifarnici.resursi["vrste-rakije"].dodaj,
    opis: sr.sifarnici.resursi["vrste-rakije"].opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: [
      { ime: "naziv", labela: P.naziv, tip: "tekst", obavezno: true },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },
  sredstva: {
    kljuc: "sredstva",
    mn: sr.sifarnici.resursi.sredstva.mn,
    dodaj: sr.sifarnici.resursi.sredstva.dodaj,
    opis: sr.sifarnici.resursi.sredstva.opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: [
      { ime: "naziv", labela: P.naziv, tip: "tekst", obavezno: true },
      { ime: "jedinica", labela: P.jedinica, tip: "tekst" },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },
  "akcizna-stopa": {
    kljuc: "akcizna-stopa",
    mn: sr.sifarnici.resursi["akcizna-stopa"].mn,
    dodaj: sr.sifarnici.resursi["akcizna-stopa"].dodaj,
    opis: sr.sifarnici.resursi["akcizna-stopa"].opis,
    poredak: { kolona: "vaziOd", smer: "desc" },
    polja: [
      { ime: "rsdPoLitruCistogAlkohola", labela: P.rsdPoLitru, tip: "broj", decimala: 4, obavezno: true },
      { ime: "vaziOd", labela: P.vaziOd, tip: "datum", obavezno: true },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },
};

export function jeResursKljuc(v: string): v is ResursKljuc {
  return v in RESURSI;
}

/** Tip jednog reda iz baze (id + dinamička polja). */
export type Stavka = { id: string } & Record<string, unknown>;

/** Mapa opcija za `izbor` polja: ključ liste → [{ vrednost, labela }]. */
export type Opcija = { vrednost: string; labela: string };
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
 * Vrednosti stižu iz FormData (sve su string ili odsutne).
 * Decimalna polja ostaju string (Drizzle numeric očekuje string).
 */
export function zodZaResurs(meta: ResursMeta) {
  const oblik: Record<string, z.ZodTypeAny> = {};

  for (const polje of meta.polja) {
    let s: z.ZodTypeAny;

    switch (polje.tip) {
      case "boolean":
        // checkbox: "on" kada je čekirano, inače odsutno
        s = z.preprocess((v) => v === "on" || v === "true" || v === true, z.boolean());
        break;
      case "ceo":
        s = z.coerce.number({ message: sr.forma.neispravanBroj }).int();
        if (!polje.obavezno) s = s.optional();
        break;
      case "broj": {
        // Validiramo kao broj, ali u bazu šaljemo string.
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
        s = polje.obavezno
          ? izbor.min(1, { message: sr.forma.obavezno })
          : praznoUNull(izbor);
        break;
      }
      default: {
        // tekst / textarea
        const tekst = z.string().trim();
        s = polje.obavezno
          ? tekst.min(1, { message: sr.forma.obavezno })
          : praznoUNull(tekst);
      }
    }

    oblik[polje.ime] = s;
  }

  return z.object(oblik);
}

/** Prazan string → null (za neobavezna polja). */
function praznoUNull(s: z.ZodType<string>) {
  return z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    s.nullable(),
  );
}
