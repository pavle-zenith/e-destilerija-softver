import { NextResponse } from "next/server";
import { eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { akcizaObracun } from "@/db/schema/akcize";
import { obavestenja } from "@/db/schema/obavestenja";
import { podesavanja } from "@/db/schema/sifarnici";
import { ucitajStanjeProizvoda } from "@/modules/magacin/stanje";
import { dinar, datum as fmtDatum } from "@/i18n/format";

/**
 * Dnevni cron (Vercel Cron) — proverava rokove akcize i niske zalihe i upisuje
 * obaveštenja. Deduplikacija: ne pravi novo obaveštenje ako već postoji 'novo'
 * za isti izvor.
 *
 * Zaštita: poziv mora nositi `Authorization: Bearer <CRON_SECRET>`.
 */
export const dynamic = "force-dynamic";

const iso = (d: Date) => d.toISOString().slice(0, 10);

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ greska: "Neovlašćen pristup" }, { status: 401 });
  }

  let noviAkciza = 0;
  let noviZalihe = 0;

  // Postojeća 'novo' obaveštenja — za deduplikaciju.
  const aktivna = await db
    .select({ referencaId: obavestenja.referencaId, tip: obavestenja.tip })
    .from(obavestenja)
    .where(eq(obavestenja.status, "novo"));
  const vecPostoji = new Set(aktivna.map((o) => `${o.tip}:${o.referencaId}`));

  // 1) Akcizni rokovi koji ističu uskoro (ili su prošli) a nisu plaćeni.
  const [pod] = await db.select().from(podesavanja).limit(1);
  const dana = pod?.podsetnikDana ?? 3;
  const granica = new Date();
  granica.setUTCDate(granica.getUTCDate() + dana);
  const granicaIso = iso(granica);

  const dospeli = await db
    .select()
    .from(akcizaObracun)
    .where(ne(akcizaObracun.status, "placeno"));
  for (const o of dospeli) {
    if (o.rok > granicaIso) continue; // još nije u prozoru podsetnika
    if (vecPostoji.has(`akciza_rok:${o.id}`)) continue;
    await db.insert(obavestenja).values({
      tip: "akciza_rok",
      naslov: `Akciza ${String(o.mesec).padStart(2, "0")}/${o.godina} (${o.deo === 1 ? "1–15" : "16–kraj"})`,
      poruka: `Iznos ${dinar(o.iznos)} dospeva ${fmtDatum(o.rok)}.`,
      rok: o.rok,
      referencaTip: "akciza_obracun",
      referencaId: o.id,
    });
    noviAkciza++;
  }

  // 2) Niske zalihe proizvoda.
  const stanje = await ucitajStanjeProizvoda();
  for (const p of stanje) {
    if (p.status === "dovoljno") continue;
    if (vecPostoji.has(`niske_zalihe:${p.id}`)) continue;
    await db.insert(obavestenja).values({
      tip: "niske_zalihe",
      naslov: `Niske zalihe: ${p.naziv}`,
      poruka: `Na stanju ${p.stanje} kom.${p.prag ? ` (prag ${p.prag}).` : "."}`,
      referencaTip: "proizvod",
      referencaId: p.id,
    });
    noviZalihe++;
  }

  return NextResponse.json({ ok: true, noviAkciza, noviZalihe });
}
