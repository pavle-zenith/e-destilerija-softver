/**
 * Kombinovani registar svih CRUD entiteta (šifarnici + proizvodnja).
 * Klijentski-bezbedno. Server tabele/računanja su u `registar.ts`.
 *
 * Nov entitet = unos ovde + unos u `TABELE` (i `IZVORI_OPCIJA`/`IZRACUNAJ` po potrebi).
 */
import { sr } from "@/i18n/sr";
import type { EntitetMeta, Polje } from "./tipovi";

const { polja: P } = sr;

/** Standardna kontakt polja koja dele kupci i dobavljači. */
const kontaktPolja: Polje[] = [
  { ime: "naziv", labela: P.naziv, tip: "tekst", obavezno: true },
  { ime: "pib", labela: P.pib, tip: "tekst" },
  { ime: "maticniBroj", labela: P.maticniBroj, tip: "tekst", uTabeli: false },
  { ime: "adresa", labela: P.adresa, tip: "tekst", uTabeli: false },
  { ime: "telefon", labela: P.telefon, tip: "tekst" },
  { ime: "email", labela: P.email, tip: "tekst" },
  { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
];

const tipSudaOpcije = [
  { vrednost: "bure", labela: sr.tipSuda.bure },
  { vrednost: "tank", labela: sr.tipSuda.tank },
  { vrednost: "cisterna", labela: sr.tipSuda.cisterna },
  { vrednost: "balon", labela: sr.tipSuda.balon },
];

export const ENTITETI: Record<string, EntitetMeta> = {
  // ───────────────────────── Šifarnici ─────────────────────────
  proizvodi: {
    kljuc: "proizvodi",
    osnovnaPutanja: "/sifarnici",
    mn: sr.sifarnici.resursi.proizvodi.mn,
    dodaj: sr.sifarnici.resursi.proizvodi.dodaj,
    opis: sr.sifarnici.resursi.proizvodi.opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: [
      { ime: "naziv", labela: P.naziv, tip: "tekst", obavezno: true },
      { ime: "vrstaRakijeId", labela: P.vrstaRakije, tip: "izbor", opcije: "vrsteRakije" },
      { ime: "zapreminaL", labela: P.zapreminaL, tip: "broj", decimala: 3, obavezno: true },
      { ime: "jacina", labela: P.jacina, tip: "broj", decimala: 2, obavezno: true },
      { ime: "barkod", labela: P.barkod, tip: "tekst", uTabeli: false },
      { ime: "pragNiskihZaliha", labela: P.pragNiskihZaliha, tip: "broj", decimala: 3, uTabeli: false },
      { ime: "aktivan", labela: P.aktivan, tip: "boolean", podrazumevano: true },
    ],
  },
  kupci: {
    kljuc: "kupci",
    osnovnaPutanja: "/sifarnici",
    mn: sr.sifarnici.resursi.kupci.mn,
    dodaj: sr.sifarnici.resursi.kupci.dodaj,
    opis: sr.sifarnici.resursi.kupci.opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: kontaktPolja,
  },
  dobavljaci: {
    kljuc: "dobavljaci",
    osnovnaPutanja: "/sifarnici",
    mn: sr.sifarnici.resursi.dobavljaci.mn,
    dodaj: sr.sifarnici.resursi.dobavljaci.dodaj,
    opis: sr.sifarnici.resursi.dobavljaci.opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: kontaktPolja,
  },
  "vrste-rakije": {
    kljuc: "vrste-rakije",
    osnovnaPutanja: "/sifarnici",
    mn: sr.sifarnici.resursi["vrste-rakije"].mn,
    dodaj: sr.sifarnici.resursi["vrste-rakije"].dodaj,
    opis: sr.sifarnici.resursi["vrste-rakije"].opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: [
      { ime: "naziv", labela: P.naziv, tip: "tekst", obavezno: true },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },
  sredstva: {
    kljuc: "sredstva",
    osnovnaPutanja: "/sifarnici",
    mn: sr.sifarnici.resursi.sredstva.mn,
    dodaj: sr.sifarnici.resursi.sredstva.dodaj,
    opis: sr.sifarnici.resursi.sredstva.opis,
    poredak: { kolona: "naziv", smer: "asc" },
    polja: [
      { ime: "naziv", labela: P.naziv, tip: "tekst", obavezno: true },
      { ime: "jedinica", labela: P.jedinica, tip: "tekst" },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },
  "akcizna-stopa": {
    kljuc: "akcizna-stopa",
    osnovnaPutanja: "/sifarnici",
    mn: sr.sifarnici.resursi["akcizna-stopa"].mn,
    dodaj: sr.sifarnici.resursi["akcizna-stopa"].dodaj,
    opis: sr.sifarnici.resursi["akcizna-stopa"].opis,
    poredak: { kolona: "vaziOd", smer: "desc" },
    polja: [
      { ime: "rsdPoLitruCistogAlkohola", labela: P.rsdPoLitru, tip: "broj", decimala: 4, obavezno: true },
      { ime: "vaziOd", labela: P.vaziOd, tip: "datum", obavezno: true },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },

  // ──────────────────────── Proizvodnja ────────────────────────
  sirovine: {
    kljuc: "sirovine",
    osnovnaPutanja: "/proizvodnja",
    mn: sr.proizvodnja.entiteti.sirovine.mn,
    dodaj: sr.proizvodnja.entiteti.sirovine.dodaj,
    opis: sr.proizvodnja.entiteti.sirovine.opis,
    poredak: { kolona: "datumPrijema", smer: "desc" },
    polja: [
      { ime: "naziv", labela: P.naziv, tip: "tekst", obavezno: true },
      { ime: "dobavljacId", labela: P.dobavljac, tip: "izbor", opcije: "dobavljaci" },
      { ime: "kolicinaKg", labela: P.kolicinaKg, tip: "broj", decimala: 2 },
      { ime: "datumPrijema", labela: P.datumPrijema, tip: "datum" },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },
  partije: {
    kljuc: "partije",
    osnovnaPutanja: "/proizvodnja",
    mn: sr.proizvodnja.entiteti.partije.mn,
    dodaj: sr.proizvodnja.entiteti.partije.dodaj,
    opis: sr.proizvodnja.entiteti.partije.opis,
    poredak: { kolona: "datumPocetka", smer: "desc" },
    polja: [
      { ime: "oznaka", labela: P.oznaka, tip: "tekst", obavezno: true },
      { ime: "sirovinaId", labela: P.sirovina, tip: "izbor", opcije: "sirovine" },
      { ime: "vrstaRakijeId", labela: P.vrstaRakije, tip: "izbor", opcije: "vrsteRakije" },
      { ime: "datumPocetka", labela: P.datumPocetka, tip: "datum" },
      { ime: "datumKraja", labela: P.datumKraja, tip: "datum", uTabeli: false },
      { ime: "prinosL", labela: P.prinosL, tip: "broj", decimala: 3 },
      { ime: "jacina", labela: P.jacina, tip: "broj", decimala: 2 },
      { ime: "haccpNapomene", labela: P.haccpNapomene, tip: "textarea", uTabeli: false },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },
  destilati: {
    kljuc: "destilati",
    osnovnaPutanja: "/proizvodnja",
    mn: sr.proizvodnja.entiteti.destilati.mn,
    dodaj: sr.proizvodnja.entiteti.destilati.dodaj,
    opis: sr.proizvodnja.entiteti.destilati.opis,
    poredak: { kolona: "datum", smer: "desc" },
    polja: [
      { ime: "oznaka", labela: P.oznaka, tip: "tekst", obavezno: true },
      { ime: "partijaId", labela: P.partija, tip: "izbor", opcije: "partije", uTabeli: false },
      { ime: "vrstaRakijeId", labela: P.vrstaRakije, tip: "izbor", opcije: "vrsteRakije" },
      { ime: "kolicinaL", labela: P.kolicinaL, tip: "broj", decimala: 3, obavezno: true },
      { ime: "jacina", labela: P.jacina, tip: "broj", decimala: 2, obavezno: true },
      { ime: "datum", labela: P.datum, tip: "datum" },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },
  sudovi: {
    kljuc: "sudovi",
    osnovnaPutanja: "/proizvodnja",
    mn: sr.proizvodnja.entiteti.sudovi.mn,
    dodaj: sr.proizvodnja.entiteti.sudovi.dodaj,
    opis: sr.proizvodnja.entiteti.sudovi.opis,
    poredak: { kolona: "oznaka", smer: "asc" },
    polja: [
      { ime: "oznaka", labela: P.oznaka, tip: "tekst", obavezno: true },
      { ime: "tip", labela: P.tipSuda, tip: "izbor", opcijeStatic: tipSudaOpcije, obavezno: true, podrazumevano: "bure" },
      { ime: "kapacitetL", labela: P.kapacitetL, tip: "broj", decimala: 3 },
      { ime: "destilatId", labela: P.destilat, tip: "izbor", opcije: "destilati" },
      { ime: "lokacija", labela: P.lokacija, tip: "tekst" },
      { ime: "napomena", labela: P.napomena, tip: "textarea", uTabeli: false },
    ],
  },
};

export function jeEntitetKljuc(v: string): boolean {
  return v in ENTITETI;
}

/** Entiteti koji pripadaju datoj sekciji (npr. "/sifarnici"). */
export function entitetiZaPutanju(osnovnaPutanja: string): EntitetMeta[] {
  return Object.values(ENTITETI).filter((e) => e.osnovnaPutanja === osnovnaPutanja);
}

/** Vraća meta entiteta ako postoji i pripada datoj sekciji, inače null. */
export function pronadjiEntitet(kljuc: string, osnovnaPutanja: string): EntitetMeta | null {
  const meta = ENTITETI[kljuc];
  return meta && meta.osnovnaPutanja === osnovnaPutanja ? meta : null;
}
