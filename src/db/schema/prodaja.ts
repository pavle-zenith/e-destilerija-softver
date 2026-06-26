import { pgTable, uuid, text, numeric, date } from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";
import { kupci, proizvodi } from "./sifarnici";
import { destilati } from "./proizvodnja";

/** Prodaja (izlazni dokument). Okida umanjenje zaliha i obračun akcize. */
export const prodaja = pgTable("prodaja", {
  id: uuid("id").primaryKey().defaultRandom(),
  broj: text("broj"),
  kupacId: uuid("kupac_id").references(() => kupci.id),
  datum: date("datum").notNull(),
  ukupnoBezAkcize: numeric("ukupno_bez_akcize", { precision: 14, scale: 2 }),
  ukupnoAkciza: numeric("ukupno_akciza", { precision: 14, scale: 2 }),
  napomena: text("napomena"),
  ...timestamps,
});

/** Stavke prodaje. */
export const prodajaStavke = pgTable("prodaja_stavke", {
  id: uuid("id").primaryKey().defaultRandom(),
  prodajaId: uuid("prodaja_id")
    .references(() => prodaja.id, { onDelete: "cascade" })
    .notNull(),
  proizvodId: uuid("proizvod_id")
    .references(() => proizvodi.id)
    .notNull(),
  /** Lot (oznaka destilata) — kičma sledljivosti prodate flaše (kao u dosadašnjoj evidenciji). */
  lot: text("lot"),
  /** Veza na destilat-lot, ako je poznat — omogućava pun lanac: prodaja → destilat → partija → sirovina. */
  destilatId: uuid("destilat_id").references(() => destilati.id),
  /** Broj prodatih jedinica (boca). */
  kolicina: numeric("kolicina", { precision: 12, scale: 3 }).notNull(),
  /** Snapshot zapremine pakovanja (L) u trenutku prodaje. */
  zapreminaL: numeric("zapremina_l", { precision: 8, scale: 3 }).notNull(),
  /** Snapshot jačine (% vol) u trenutku prodaje. */
  jacina: numeric("jacina", { precision: 5, scale: 2 }).notNull(),
  /** Izračunata zapremina čistog alkohola = kolicina * zapreminaL * jacina/100. */
  cistAlkoholL: numeric("cist_alkohol_l", { precision: 12, scale: 3 }).notNull(),
  cenaJedinice: numeric("cena_jedinice", { precision: 14, scale: 2 }),
  ...timestamps,
});
