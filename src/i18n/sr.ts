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
    storniraj: "Storniraj",
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
    pogresnaLozinka: "Pogrešna lozinka.",
    naslov: "Prijava na eDestilerija",
  },

  // Faza 1 — Šifarnici
  sifarnici: {
    opis: "Matični podaci: proizvodi, kupci, dobavljači, vrste rakije, enološka sredstva i akcizna stopa",
    // Naslovi i opisi po resursu (množina, jednina za dugmad, opis za karticu)
    resursi: {
      proizvodi: {
        mn: "Proizvodi",
        dodaj: "Novi proizvod",
        opis: "Prodajni proizvodi (SKU) — pakovanje, zapremina i jačina",
      },
      kupci: {
        mn: "Kupci",
        dodaj: "Novi kupac",
        opis: "Pravna i fizička lica kojima se prodaje",
      },
      dobavljaci: {
        mn: "Dobavljači",
        dodaj: "Novi dobavljač",
        opis: "Dobavljači sirovina i materijala",
      },
      "vrste-rakije": {
        mn: "Vrste rakije",
        dodaj: "Nova vrsta rakije",
        opis: "Npr. šljivovica, kajsijevača, lozovača",
      },
      sredstva: {
        mn: "Enološka sredstva",
        dodaj: "Novo sredstvo",
        opis: "Šifarnik enoloških sredstava i jedinica mere",
      },
      "akcizna-stopa": {
        mn: "Akcizna stopa",
        dodaj: "Nova stopa",
        opis: "Iznos akcize po litru čistog alkohola, verzionisan po datumu",
      },
    },
  },

  // Nazivi polja (zajednički rečnik za forme i tabele)
  polja: {
    naziv: "Naziv",
    pib: "PIB",
    maticniBroj: "Matični broj",
    adresa: "Adresa",
    telefon: "Telefon",
    email: "Imejl",
    napomena: "Napomena",
    vrstaRakije: "Vrsta rakije",
    zapreminaL: "Zapremina (L)",
    jacina: "Jačina (% vol)",
    barkod: "Barkod",
    pragNiskihZaliha: "Prag niskih zaliha (jed.)",
    aktivan: "Aktivan",
    jedinica: "Jedinica mere",
    rsdPoLitru: "RSD po litru čistog alkohola",
    vaziOd: "Važi od",
    // Proizvodnja
    oznaka: "Oznaka",
    dobavljac: "Dobavljač",
    kolicinaKg: "Količina (kg)",
    datumPrijema: "Datum prijema",
    sirovina: "Sirovina",
    datumPocetka: "Datum početka",
    datumKraja: "Datum kraja",
    prinosL: "Prinos (L)",
    haccpNapomene: "HACCP napomene",
    partija: "Partija",
    kolicinaL: "Količina (L)",
    datum: "Datum",
    tipSuda: "Tip suda",
    kapacitetL: "Kapacitet (L)",
    destilat: "Destilat",
    lokacija: "Lokacija",
    // Podešavanja
    nazivFirme: "Naziv firme",
    akcizaRokDana: "Rok plaćanja akcize (dana posle perioda)",
    podsetnikDana: "Podsetnik koliko dana pre roka",
  },

  // Faza 2 — Proizvodnja
  proizvodnja: {
    opis: "Prijem sirovina, proizvodne partije, destilati i sudovi za skladištenje",
    entiteti: {
      sirovine: {
        mn: "Sirovine",
        dodaj: "Nov prijem sirovine",
        opis: "Prijem voća i drugih sirovina od dobavljača",
      },
      partije: {
        mn: "Proizvodne partije",
        dodaj: "Nova partija",
        opis: "Fermentacija i destilacija — HACCP evidencija",
      },
      destilati: {
        mn: "Destilati",
        dodaj: "Nov destilat",
        opis: "Lotovi gotovog destilata (čist alkohol se računa automatski)",
      },
      sudovi: {
        mn: "Sudovi",
        dodaj: "Nov sud",
        opis: "Burad, tankovi i cisterne — svaki nosi jedinstveni QR kod",
      },
    },
  },

  tipSuda: {
    bure: "Bure",
    tank: "Tank",
    cisterna: "Cisterna",
    balon: "Balon",
  },

  // Faza 5 — Dashboard
  pregledUI: {
    opis: "Brzi pregled stanja destilerije",
    aktivnePartije: "Aktivne partije",
    bocaNaStanju: "Boca na stanju",
    akcizaPeriod: "Akciza — tekući period",
    novaObavestenja: "Nova obaveštenja",
    prodajaPoMesecima: "Čist alkohol u prodaji po mesecima (L)",
    nemaProdaje: "Još nema prodaje za prikaz.",
  },

  obavestenjaUI: {
    opis: "Podsetnici za rokove akcize i niske zalihe (generiše dnevni cron)",
    bezObavestenja: "Nema obaveštenja.",
    oznaciReseno: "Reši",
    tip: {
      akciza_rok: "Rok akcize",
      niske_zalihe: "Niske zalihe",
      sistem: "Sistem",
    },
    status: {
      novo: "Novo",
      procitano: "Pročitano",
      reseno: "Rešeno",
    },
  },

  // Faza 4 — Prodaja
  prodajaUI: {
    opis: "Izlazni računi — stavke sa lotom; umanjuje zalihe i ulazi u obračun akcize",
    broj: "Broj računa",
    kupac: "Kupac",
    stavke: "Stavke",
    dodajStavku: "Dodaj stavku",
    bezStavki: "Dodajte bar jednu stavku sa proizvodom i količinom",
    izaberiKupca: "— Izaberi kupca —",
    izaberiProizvod: "— Proizvod —",
    izaberiLot: "— Lot —",
    brojBoca: "Boca",
    cena: "Cena/kom",
    ukupnoCist: "Čist alkohol",
    ukupnoAkciza: "Procenjena akciza",
    ukupnoIznos: "Iznos (bez akcize)",
  },

  akcizeUI: {
    obracunaj: "Obračunaj period",
    preracunaj: "Preračunaj",
    oznaciPlaceno: "Označi kao plaćeno",
    nemaObracuna: "Još nema obračuna. Periodi sa prodajom su dole.",
    periodi: "Periodi sa prodajom",
    obracuni: "Obračuni",
    dospelo: "Dospelo za plaćanje",
    period: "Period",
    litaraCistog: "Litara čistog",
    stopa: "Stopa",
    nemaStope: "Nije podešena akcizna stopa za ovaj period",
    ppOaNaslov: "PP-OA — obračun akcize",
  },

  // Faza 3 — Magacin
  magacin: {
    opis: "Stanje zaliha — gotovi proizvodi (boce) i rinfuz u sudovima",
    boce: "Gotovi proizvodi (boce)",
    rinfuz: "Rinfuz (sudovi)",
    naStanju: "Na stanju",
    komada: "kom.",
    prag: "Prag",
    status: "Status",
    kapacitet: "Kapacitet",
    popunjenost: "Popunjenost",
    dovoljno: "Dovoljno",
    nemaNaStanju: "Nema na stanju",
    bezSudova: "Još nema sudova sa zalihama.",
    bezProizvoda: "Još nema proizvoda na stanju.",
  },

  egalizacija: {
    naslov: "Egalizacija",
    opis: "Mešanje više destilata u jedan novi lot",
    oznakaPolja: "Oznaka egalizacije",
    ulazi: "Ulazni destilati",
    dodajUlaz: "Dodaj destilat",
    bezUlaza: "Dodajte bar jedan ulazni destilat sa količinom",
    rezultat: "Rezultujući destilat",
    ukupnoL: "Ukupno",
    procenjenaJacina: "Procenjena jačina",
    brojUlaza: "Ulaza",
    izaberiDestilat: "— Izaberi destilat —",
  },

  punjenje: {
    naslov: "Punjenje",
    opis: "Punjenje destilata u sud (rinfuz) ili u boce (proizvod)",
    nacin: "Način punjenja",
    uSud: "U sud (rinfuz)",
    uBoce: "U boce (proizvod)",
    brojBoca: "Broj boca",
    izaberiDestilat: "— Izaberi destilat —",
    izaberiSud: "— Izaberi sud —",
    izaberiProizvod: "— Izaberi proizvod —",
    amOd: "Markice od",
    amDo: "Markice do",
    markice: "Akcizne markice",
  },

  sledljivostUI: {
    opis: "Skenirajte QR kod suda ili izaberite sud da vidite ceo lanac",
    izaberiSud: "Izaberite sud",
    otvoriLanac: "Otvori lanac",
    lanac: "Lanac sledljivosti",
    nemaLanca: "Nema podataka za ovaj kod",
    nalepnice: "QR nalepnice",
    odstampaj: "Odštampaj",
    skenirajte: "Skenirajte za istoriju lota",
    bezLotova: "Nema destilata. Dodajte ih u Proizvodnja → Destilati (ili egalizacijom).",
    bezSudova: "Nema sudova. Dodajte ih u Proizvodnja → Sudovi.",
  },

  koraci: {
    sirovina: "Sirovina",
    partija: "Proizvodna partija",
    destilat: "Destilat",
    egalizacija: "Egalizacija",
    punjenje: "Punjenje",
    sud: "Sud",
    prodaja: "Prodaja",
  },

  forma: {
    obavezno: "Obavezno polje",
    neispravanBroj: "Unesite ispravan broj",
    neispravanDatum: "Unesite ispravan datum",
    greskaCuvanja: "Greška pri čuvanju. Pokušajte ponovo.",
    vecPostoji: "Već postoji zapis sa tom vrednošću (npr. LOT/oznaka mora biti jedinstven).",
    potvrdaBrisanja: "Da li sigurno želite da obrišete ovu stavku?",
    potvrdaStorna: "Stornirati ovaj zapis? Nuspojave (zalihe/akciza) se vraćaju.",
    da: "Da",
    ne: "Ne",
    odaberi: "— Odaberi —",
    nemaUnosa: "Još nema unosa. Kliknite na dugme da dodate prvi.",
  },
} as const;

export type Recnik = typeof sr;
