/**
 * Centralni rečnik svih UI stringova (srpska latinica).
 * Sav tekst u aplikaciji prolazi kroz ovaj objekat kako bi prevod/izmena
 * bili na jednom mestu i kako se nijedan engleski string ne bi pojavio u UI-ju.
 */
export const sr = {
  app: {
    naziv: "eDestilerija",
    opis: "Softver za upravljanje destilerijom",
  },

  nav: {
    pregled: "Pregled",
    proizvodnja: "Proizvodnja",
    sledljivost: "Sledljivost",
    magacin: "Magacin",
    prodaja: "Prodaja",
    akcize: "Akcize",
    izvestaji: "Izveštaji",
    sifarnici: "Šifarnici",
    podesavanja: "Podešavanja",
    obavestenja: "Obaveštenja",
  },

  // Pojmovi koji se ponavljaju kroz module
  pojmovi: {
    sirovine: "Sirovine",
    partije: "Proizvodne partije",
    destilati: "Destilati",
    egalizacija: "Egalizacija",
    punjenje: "Punjenje",
    sudovi: "Sudovi",
    enoloskaSredstva: "Enološka sredstva",
    proizvodi: "Proizvodi",
    kupci: "Kupci",
    dobavljaci: "Dobavljači",
    vrsteRakije: "Vrste rakije",
    akcizaStopa: "Akcizna stopa",
    cistAlkohol: "Čist alkohol",
    jacina: "Jačina",
    kolicina: "Količina",
    zalihe: "Zalihe",
    rok: "Rok",
    period: "Period",
    iznos: "Iznos",
  },

  akciza: {
    deo1: "Prvi deo meseca (1–15)",
    deo2: "Drugi deo meseca (16–kraj)",
    obracunato: "Obračunato",
    placeno: "Plaćeno",
    rokPlacanja: "Rok plaćanja",
    litaraCistogAlkohola: "Litara čistog alkohola",
    nijePlaceno: "Nije plaćeno",
    pp0a: "Obrazac PP-OA",
  },

  akcije: {
    dodaj: "Dodaj",
    izmeni: "Izmeni",
    obrisi: "Obriši",
    sacuvaj: "Sačuvaj",
    otkazi: "Otkaži",
    odustani: "Odustani",
    pretrazi: "Pretraži",
    stampaj: "Štampaj",
    izvezi: "Izvezi",
    detalji: "Detalji",
    nazad: "Nazad",
    potvrdi: "Potvrdi",
  },

  stanje: {
    ucitavanje: "Učitavanje…",
    nemaPodataka: "Nema podataka",
    greska: "Došlo je do greške",
    sacuvano: "Sačuvano",
    obrisano: "Obrisano",
    niskeZalihe: "Niske zalihe",
    kriticno: "Kritično",
  },

  auth: {
    prijava: "Prijava",
    odjava: "Odjava",
    email: "Imejl",
    lozinka: "Lozinka",
    prijaviSe: "Prijavi se",
  },
} as const;

export type Recnik = typeof sr;
