import { pgTable, uuid, text, numeric, integer, date } from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";
import { tipPrometaEnum, tipSudaEnum } from "./enums";
import { destilati } from "./proizvodnja";
import { proizvodi as proizvodiSku } from "./sifarnici";

// Napomena: `destilati` se uvozi iz proizvodnja, a prodajni `proizvodi` (SKU) iz sifarnici.

/** Sud za skladištenje destilata u rinfuzi (bure/tank). Nosi QR kod. */
export const sudovi = pgTable("sudovi", {
  id: uuid("id").primaryKey().defaultRandom(),
  oznaka: text("oznaka").notNull(),
  tip: tipSudaEnum("tip").default("bure").notNull(),
  kapacitetL: numeric("kapacitet_l", { precision: 12, scale: 3 }),
  trenutnaKolicinaL: numeric("trenutna_kolicina_l", { precision: 12, scale: 3 })
    .default("0")
    .notNull(),
  /** Destilat koji se trenutno nalazi u sudu. */
  destilatId: uuid("destilat_id").references(() => destilati.id),
  /** Jedinstveni QR kod (sadržaj nalepnice). */
  qrKod: text("qr_kod").unique().notNull(),
  lokacija: text("lokacija"),
  napomena: text("napomena"),
  ...timestamps,
});

/** Punjenje — destilat se puni u sud (rinfuz) ili u boce (proizvod). Ulaz u magacin. */
export const punjenje = pgTable("punjenje", {
  id: uuid("id").primaryKey().defaultRandom(),
  destilatId: uuid("destilat_id")
    .references(() => destilati.id)
    .notNull(),
  /** Ako se puni u sud (rinfuz). */
  sudId: uuid("sud_id").references(() => sudovi.id),
  /** Ako se puni u boce — prodajni proizvod (SKU). */
  proizvodId: uuid("proizvod_id").references(() => proizvodiSku.id),
  /** Količina u litrima (rinfuz) ili ukupna zapremina napunjenih boca. */
  kolicinaL: numeric("kolicina_l", { precision: 12, scale: 3 }),
  /** Broj napunjenih jedinica (boca), ako je punjenje u proizvod. */
  brojJedinica: integer("broj_jedinica"),
  datum: date("datum"),
  napomena: text("napomena"),
  ...timestamps,
});

/** Skladišni promet — svaki ulaz/izlaz. Stanje proizvoda = suma prometa. */
export const magacinPromet = pgTable("magacin_promet", {
  id: uuid("id").primaryKey().defaultRandom(),
  proizvodId: uuid("proizvod_id").references(() => proizvodiSku.id),
  sudId: uuid("sud_id").references(() => sudovi.id),
  tip: tipPrometaEnum("tip").notNull(),
  /** Količina u jedinici proizvoda (broj boca) ili litrima (rinfuz). */
  kolicina: numeric("kolicina", { precision: 12, scale: 3 }).notNull(),
  /** Tip izvora prometa: 'punjenje' | 'prodaja' | 'korekcija'. */
  referencaTip: text("referenca_tip"),
  referencaId: uuid("referenca_id"),
  datum: date("datum"),
  napomena: text("napomena"),
  ...timestamps,
});
