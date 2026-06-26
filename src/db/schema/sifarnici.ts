import {
  pgTable,
  uuid,
  text,
  numeric,
  integer,
  boolean,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";

/** Dobavljači sirovina i materijala. */
export const dobavljaci = pgTable("dobavljaci", {
  id: uuid("id").primaryKey().defaultRandom(),
  naziv: text("naziv").notNull(),
  pib: text("pib"),
  maticniBroj: text("maticni_broj"),
  adresa: text("adresa"),
  telefon: text("telefon"),
  email: text("email"),
  napomena: text("napomena"),
  ...timestamps,
});

/** Kupci. */
export const kupci = pgTable("kupci", {
  id: uuid("id").primaryKey().defaultRandom(),
  naziv: text("naziv").notNull(),
  pib: text("pib"),
  maticniBroj: text("maticni_broj"),
  adresa: text("adresa"),
  telefon: text("telefon"),
  email: text("email"),
  napomena: text("napomena"),
  ...timestamps,
});

/** Vrste rakije (npr. šljivovica, kajsijevača). */
export const vrsteRakije = pgTable("vrste_rakije", {
  id: uuid("id").primaryKey().defaultRandom(),
  naziv: text("naziv").notNull(),
  napomena: text("napomena"),
  ...timestamps,
});

/** Prodajni proizvodi (SKU) — npr. boca 0.7L šljivovice. */
export const proizvodi = pgTable("proizvodi", {
  id: uuid("id").primaryKey().defaultRandom(),
  naziv: text("naziv").notNull(),
  vrstaRakijeId: uuid("vrsta_rakije_id").references(() => vrsteRakije.id),
  /** Zapremina pakovanja u litrima (npr. 0.700). */
  zapreminaL: numeric("zapremina_l", { precision: 8, scale: 3 }).notNull(),
  /** Jačina u % vol. */
  jacina: numeric("jacina", { precision: 5, scale: 2 }).notNull(),
  barkod: text("barkod"),
  /** Prag ispod kojeg se okida obaveštenje o niskim zalihama (broj jedinica). */
  pragNiskihZaliha: numeric("prag_niskih_zaliha", { precision: 12, scale: 3 }),
  aktivan: boolean("aktivan").default(true).notNull(),
  ...timestamps,
});

/** Šifarnik enoloških sredstava. */
export const enoloskaSredstva = pgTable("enoloska_sredstva", {
  id: uuid("id").primaryKey().defaultRandom(),
  naziv: text("naziv").notNull(),
  jedinica: text("jedinica"),
  napomena: text("napomena"),
  ...timestamps,
});

/** Akcizna stopa — RSD po litru čistog (apsolutnog) alkohola, verzionisana po datumu. */
export const akcizaStopa = pgTable("akciza_stopa", {
  id: uuid("id").primaryKey().defaultRandom(),
  rsdPoLitruCistogAlkohola: numeric("rsd_po_litru", { precision: 12, scale: 4 }).notNull(),
  vaziOd: date("vazi_od").notNull(),
  napomena: text("napomena"),
  ...timestamps,
});

/** Globalna podešavanja (singleton red, id = 1). */
export const podesavanja = pgTable(
  "podesavanja",
  {
    id: integer("id").primaryKey().default(1),
    nazivFirme: text("naziv_firme"),
    pib: text("pib"),
    maticniBroj: text("maticni_broj"),
    adresa: text("adresa"),
    /** Broj dana posle kraja perioda do roka plaćanja akcize. */
    akcizaRokDana: integer("akciza_rok_dana").default(15).notNull(),
    /** Koliko dana pre roka da se pošalje podsetnik. */
    podsetnikDana: integer("podsetnik_dana").default(3).notNull(),
    ...timestamps,
  },
  (t) => [uniqueIndex("podesavanja_singleton_idx").on(t.id)],
);
