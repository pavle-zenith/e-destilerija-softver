import { NextResponse, type NextRequest } from "next/server";
import { proveriToken, SESIJA_KOLACIC } from "@/lib/sesija";

/**
 * Štiti sve rute osim prijave, cron-a i statike. Bez važeće sesije → /prijava.
 * Pokriva i server akcije (POST na rute) jer middleware presreće sve zahteve.
 */
export async function middleware(req: NextRequest) {
  const validna = await proveriToken(req.cookies.get(SESIJA_KOLACIC)?.value);
  if (validna) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/prijava";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Sve osim: prijava, /api/cron, Next statika, favicon i manifest.
    "/((?!prijava|api/cron|_next/static|_next/image|favicon.ico|manifest.webmanifest|icon|apple-icon).*)",
  ],
};
