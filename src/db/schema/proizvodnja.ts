import { pgTable, uuid, text, numeric, date } from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";
import { dobavljaci, vrsteRakije, enoloskaSredstva } from "./sifarnici";

/** Prijem sirovine (voće i sl.). */
export const sirovine = pgTable("sirovine", {
  id: uuid("id").primaryKey().defaultRandom(),
  naziv: text("naziv").notNull(),
  dobavljacId: uuid("dobavljac_id").references(() => dobavljaci.id),
  kolicinaKg: numeric("kolicina_kg", { precision: 12, scale: 2 }),
  datumPrijema: date("datum_prijema"),
  napomena: text("napomena"),
  ...timestamps,
});

/** Proizvodna partija — fermentacija + prva/druga destilacija (HACCP). */
export const proizvodnePartije = pgTable("proizvodne_partije", {
  id: uuid("id").primaryKey().defaultRandom(),
  oznaka: text("oznaka").notNull(),
  sirovinaId: uuid("sirovina_id").references(() => sirovine.id),
  vrstaRakijeId: uuid("vrsta_rakije_id").references(() => vrsteRakije.id),
  datumPocetka: date("datum_pocetka"),
  datumKraja: date("datum_kraja"),
  /** Prinos (sirovi destilat) u litrima. */
  prinosL: numeric("prinos_l", { precision: 12, scale: 3 }),
  /** Izmerena jačina nakon druge destilacije, % vol. */
  jacina: numeric("jacina", { precision: 5, scale: 2 }),
  haccpNapomene: text("haccp_napomene"),
  napomena: text("napomena"),
  ...timestamps,
});

/** Destilat (lot gotovog destilata, polazna tačka za egalizaciju/punjenje). */
export const destilati = pgTable("destilati", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** LOT — mora biti jedinstven (ne sme se dva puta uneti ista oznaka). */
  oznaka: text("oznaka").notNull().unique(),
  partijaId: uuid("partija_id").references(() => proizvodnePartije.id),
  vrstaRakijeId: uuid("vrsta_rakije_id").references(() => vrsteRakije.id),
  kolicinaL: numeric("kolicina_l", { precision: 12, scale: 3 }).notNull(),
  jacina: numeric("jacina", { precision: 5, scale: 2 }).notNull(),
  /** Izračunata zapremina čistog alkohola = kolicinaL * jacina/100. */
  cistAlkoholL: numeric("cist_alkohol_l", { precision: 12, scale: 3 }),
  datum: date("datum"),
  napomena: text("napomena"),
  ...timestamps,
});

/** Egalizacija — događaj mešanja koji proizvodi novi destilat (lot). */
export const egalizacija = pgTable("egalizacija", {
  id: uuid("id").primaryKey().defaultRandom(),
  oznaka: text("oznaka").notNull(),
  /** Rezultujući destilat nastao egalizacijom. */
  rezultatDestilatId: uuid("rezultat_destilat_id").references(() => destilati.id),
  datum: date("datum"),
  napomena: text("napomena"),
  ...timestamps,
});

/** Ulazni destilati u egalizaciju (sa pripadajućim količinama). */
export const egalizacijaUlazi = pgTable("egalizacija_ulazi", {
  id: uuid("id").primaryKey().defaultRandom(),
  egalizacijaId: uuid("egalizacija_id")
    .references(() => egalizacija.id, { onDelete: "cascade" })
    .notNull(),
  destilatId: uuid("destilat_id")
    .references(() => destilati.id)
    .notNull(),
  kolicinaL: numeric("kolicina_l", { precision: 12, scale: 3 }).notNull(),
  ...timestamps,
});

/** Evidencija upotrebe enoloških sredstava na partiji ili destilatu. */
export const upotrebaSredstava = pgTable("upotreba_sredstava", {
  id: uuid("id").primaryKey().defaultRandom(),
  sredstvoId: uuid("sredstvo_id")
    .references(() => enoloskaSredstva.id)
    .notNull(),
  partijaId: uuid("partija_id").references(() => proizvodnePartije.id),
  destilatId: uuid("destilat_id").references(() => destilati.id),
  kolicina: numeric("kolicina", { precision: 12, scale: 3 }),
  datum: date("datum"),
  napomena: text("napomena"),
  ...timestamps,
});
