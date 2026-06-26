import { pgTable, uuid, text, date } from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";
import { tipObavestenjaEnum, statusObavestenjaEnum } from "./enums";

/** Obaveštenja / podsetnici (rokovi akciza, niske zalihe, sistemske poruke). */
export const obavestenja = pgTable("obavestenja", {
  id: uuid("id").primaryKey().defaultRandom(),
  tip: tipObavestenjaEnum("tip").notNull(),
  naslov: text("naslov").notNull(),
  poruka: text("poruka"),
  rok: date("rok"),
  status: statusObavestenjaEnum("status").default("novo").notNull(),
  /** Veza ka izvoru: 'akciza_obracun' | 'proizvod' itd. */
  referencaTip: text("referenca_tip"),
  referencaId: uuid("referenca_id"),
  ...timestamps,
});
