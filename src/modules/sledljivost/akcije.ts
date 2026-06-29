"use server";

import { sastaviLanacZaLot } from "./lanac";
import type { Lanac } from "@/lib/sledljivost";

/** Vraća lanac sledljivosti za lot (za inline prikaz na /sledljivost). */
export async function ucitajLanacLota(oznaka: string): Promise<Lanac | null> {
  if (!oznaka) return null;
  return sastaviLanacZaLot(oznaka);
}
