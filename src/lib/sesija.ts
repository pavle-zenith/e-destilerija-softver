/**
 * Potpisani sesijski token (HMAC-SHA256) za jednostavnu prijavu jednim nalogom.
 * Koristi Web Crypto (radi i u Edge middleware-u i u Node runtime-u).
 *
 * Token = `${istekMs}.${potpis}`. Validan dok potpis odgovara i istek nije prošao.
 * "Zapamti me" je realizovano dugim rokom kolačića (vidi auth akcije).
 */
const enc = new TextEncoder();
export const SESIJA_KOLACIC = "sesija";

async function kljuc(): Promise<CryptoKey> {
  const tajna = process.env.SESIJA_TAJNA;
  if (!tajna) throw new Error("SESIJA_TAJNA nije postavljena u okruženju.");
  return crypto.subtle.importKey("raw", enc.encode(tajna), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
  ]);
}

function b64url(buf: ArrayBuffer): string {
  let s = "";
  for (const b of new Uint8Array(buf)) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function potpisi(podatak: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await kljuc(), enc.encode(podatak));
  return b64url(sig);
}

/** Pravi token koji ističe za `dana` dana. */
export async function napraviToken(dana = 90): Promise<string> {
  const istek = String(Date.now() + dana * 24 * 60 * 60 * 1000);
  return `${istek}.${await potpisi(istek)}`;
}

/** Tačno ako je token validan (potpis odgovara) i nije istekao. */
export async function proveriToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const tacka = token.indexOf(".");
  if (tacka < 0) return false;
  const payload = token.slice(0, tacka);
  const potpis = token.slice(tacka + 1);
  const istek = Number(payload);
  if (!Number.isFinite(istek) || istek < Date.now()) return false;
  return potpis === (await potpisi(payload));
}
