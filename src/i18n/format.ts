/**
 * Formatери za srpski lokalitet (sr-RS): valuta RSD, brojevi sa decimalnim
 * zarezom, datumi, procenti i litri. Sve na jednom mestu.
 */

const LOCALE = "sr-RS";

/** Pretvara string|number|null u broj (Drizzle numeric vraća string). */
function toNumber(v: string | number | null | undefined): number {
  if (v === null || v === undefined || v === "") return 0;
  return typeof v === "number" ? v : Number(v);
}

/** Iznos u dinarima: "1.234,56 RSD". */
export function dinar(v: string | number | null | undefined): string {
  return new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: "RSD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(v));
}

/** Običan broj sa zadatim brojem decimala. */
export function broj(
  v: string | number | null | undefined,
  decimala = 2,
): string {
  return new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimala,
    maximumFractionDigits: decimala,
  }).format(toNumber(v));
}

/** Litri: "12,500 L". */
export function litara(v: string | number | null | undefined): string {
  return `${broj(v, 3)} L`;
}

/** Procenat alkohola: "40,00 %". */
export function procenat(v: string | number | null | undefined): string {
  return `${broj(v, 2)} %`;
}

/** Datum: "26.06.2026.". Prima Date ili ISO/`YYYY-MM-DD` string. */
export function datum(v: Date | string | null | undefined): string {
  if (!v) return "";
  const d = typeof v === "string" ? new Date(v) : v;
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}
