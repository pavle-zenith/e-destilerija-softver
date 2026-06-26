import { randomUUID } from "crypto";

/**
 * Pomoćne funkcije za QR kodove sudova/lotova.
 * Ovde se definiše SADRŽAJ koda (šta QR enkodira). Generisanje slike/PDF-a
 * nalepnice dolazi u Fazi 2 (qrcode + @react-pdf/renderer).
 */

/** Generiše jedinstveni QR kod za sud, npr. "BURE-1A2B3C4D". */
export function generisiQrKod(prefiks = "SUD"): string {
  const kratak = randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
  return `${prefiks}-${kratak}`;
}

/**
 * Putanja interne stranice istorije (sledljivosti) za dati QR kod.
 * Skeniranje koda otvara ovu rutu u aplikaciji.
 */
export function putanjaSledljivosti(qrKod: string): string {
  return `/sledljivost/qr/${encodeURIComponent(qrKod)}`;
}

/** Puni URL koji se enkodira u QR (zahteva baznu adresu aplikacije). */
export function qrSadrzaj(qrKod: string, baznaAdresa: string): string {
  return new URL(putanjaSledljivosti(qrKod), baznaAdresa).toString();
}
