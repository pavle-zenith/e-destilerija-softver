import {
  pgTable,
  uuid,
  integer,
  numeric,
  date,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { timestamps } from "./_shared";
import { statusAkcizeEnum } from "./enums";

/**
 * Obračun akcize po obračunskom periodu.
 * Srpski sistem: dva perioda mesečno — deo 1 (1.–15.) i deo 2 (16.–kraj).
 */
export const akcizaObracun = pgTable(
  "akciza_obracun",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    godina: integer("godina").notNull(),
    mesec: integer("mesec").notNull(),
    /** Deo meseca: 1 = 1.–15., 2 = 16.–kraj. */
    deo: integer("deo").notNull(),
    periodOd: date("period_od").notNull(),
    periodDo: date("period_do").notNull(),
    /** Ukupno litara čistog alkohola u prodaji za period. */
    litaraCistogAlkohola: numeric("litara_cistog_alkohola", {
      precision: 14,
      scale: 3,
    }).notNull(),
    /** Snapshot primenjene stope (RSD po litru čistog alkohola). */
    stopa: numeric("stopa", { precision: 12, scale: 4 }).notNull(),
    iznos: numeric("iznos", { precision: 14, scale: 2 }).notNull(),
    /** Rok plaćanja. */
    rok: date("rok").notNull(),
    status: statusAkcizeEnum("status").default("obracunato").notNull(),
    datumPlacanja: date("datum_placanja"),
    napomena: text("napomena"),
    ...timestamps,
  },
  (t) => [uniqueIndex("akciza_period_idx").on(t.godina, t.mesec, t.deo)],
);
