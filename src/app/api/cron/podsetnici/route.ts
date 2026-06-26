import { NextResponse } from "next/server";

/**
 * Dnevni cron job (Vercel Cron) — proverava rokove akcize i niske zalihe
 * i generiše obaveštenja. Puna logika dolazi u Fazi 4.
 *
 * Zaštita: poziv mora nositi `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ greska: "Neovlašćen pristup" }, { status: 401 });
  }

  // TODO (Faza 4): proveriti akciza_obracun rokove i magacin pragove,
  // upisati obavestenja, opciono poslati email.
  return NextResponse.json({
    ok: true,
    poruka: "Provera podsetnika — implementacija u Fazi 4.",
  });
}
