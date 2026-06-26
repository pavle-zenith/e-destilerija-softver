import { timestamp } from "drizzle-orm/pg-core";

/** Zajedničke kolone evidencije vremena za sve tabele. */
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};
