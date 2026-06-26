"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sr } from "@/i18n/sr";
import { napraviToken, SESIJA_KOLACIC } from "@/lib/sesija";
import type { StanjeForme } from "@/modules/crud/tipovi";

const DANA = 90; // "zapamti me" — sesija traje 90 dana

export async function prijaviSe(_prethodno: StanjeForme, formData: FormData): Promise<StanjeForme> {
  const lozinka = String(formData.get("lozinka") ?? "");
  const tacna = process.env.APP_LOZINKA;
  if (!tacna || lozinka !== tacna) {
    return { ok: false, poruka: sr.auth.pogresnaLozinka };
  }

  const c = await cookies();
  c.set(SESIJA_KOLACIC, await napraviToken(DANA), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DANA * 24 * 60 * 60,
  });
  redirect("/");
}

export async function odjava(): Promise<void> {
  const c = await cookies();
  c.delete(SESIJA_KOLACIC);
  redirect("/prijava");
}
