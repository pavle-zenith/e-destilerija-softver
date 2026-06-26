"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { obavestenja } from "@/db/schema/obavestenja";

/** Označava obaveštenje kao rešeno (koristi se kao form `action`). */
export async function resiObavestenje(id: string): Promise<void> {
  try {
    await db
      .update(obavestenja)
      .set({ status: "reseno", updatedAt: new Date() })
      .where(eq(obavestenja.id, id));
  } catch (e) {
    console.error("Greška pri rešavanju obaveštenja", e);
    return;
  }
  revalidatePath("/obavestenja");
}
