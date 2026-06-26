import { pgEnum } from "drizzle-orm/pg-core";

/** Tip skladišnog prometa. */
export const tipPrometaEnum = pgEnum("tip_prometa", ["ulaz", "izlaz"]);

/** Tip suda za skladištenje destilata u rinfuzi. */
export const tipSudaEnum = pgEnum("tip_suda", ["bure", "tank", "cisterna", "balon"]);

/** Status obračuna akcize. */
export const statusAkcizeEnum = pgEnum("status_akcize", ["obracunato", "placeno"]);

/** Tip obaveštenja (podsetnika). */
export const tipObavestenjaEnum = pgEnum("tip_obavestenja", [
  "akciza_rok",
  "niske_zalihe",
  "sistem",
]);

/** Status obaveštenja. */
export const statusObavestenjaEnum = pgEnum("status_obavestenja", [
  "novo",
  "procitano",
  "reseno",
]);
