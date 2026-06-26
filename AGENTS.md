<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# eDestilerija softver — vodič za rad

In-house softver za upravljanje srpskom destilerijom rakije. Modularno, gradi se po fazama.
`CLAUDE.md` uvozi ovaj fajl — ovo je jedini izvor istine, oba se ažuriraju zajedno.

**UI je isključivo na srpskom (latinica). Nijedan engleski string ne sme u UI** — sav tekst ide kroz
`src/i18n/sr.ts`. Imenovanje u kodu (varijable, tabele, rute) je takođe na srpskom radi doslednosti.

## Tehnološki stek
- **Next.js 16 (App Router) + TypeScript + React 19**, **Tailwind v4**, lucide-react ikone.
- **Supabase (Postgres)** za bazu, Auth (jedan nalog) i Storage.
- **Drizzle ORM** za šemu i migracije (`src/db`).
- **Vercel** hosting + **Vercel Cron** za podsetnike. PWA (telefon) preko `public/manifest.webmanifest`.
- Hosting baze i deploy se rade preko Supabase/Vercel MCP alata.

## Komande
```bash
npm run dev          # lokalni razvoj (http://localhost:3000)
npm run build        # produkciona provera build-a
npm run lint         # ESLint
npm run db:generate  # generiše SQL migraciju iz izmenjene šeme
npm run db:migrate   # primeni migracije na bazu
npm run db:push      # gurni šemu direktno (brzo, za razvoj)
npm run db:studio    # Drizzle Studio (pregled baze)
npm run db:seed      # ubaci test podatke (src/db/seed.ts)
```
Tajne idu u `.env.local` (vidi `.env.example`). Bez `DATABASE_URL` baza ne radi.

## Struktura
- `src/db/schema/*` — Drizzle tabele (jedan izvor istine za model podataka). `index.ts` re-export.
- `src/db/index.ts` — DB klijent (postgres-js).
- `src/lib/akciza.ts` — obračun akcize (čiste funkcije, bez baze). **Srce compliance logike.**
- `src/lib/sledljivost.ts` — sklapanje lanca sledljivosti.
- `src/lib/qr.ts` — sadržaj/putanje QR kodova.
- `src/i18n/sr.ts` — svi UI stringovi; `src/i18n/format.ts` — `sr-RS` formatери (RSD, datumi, %).
- `src/components/*` — deljeni UI (sidebar, page-header, placeholder, kasnije `ui/` shadcn).
- `src/modules/<feature>/*` — logika i UI po modulu (dodaju se po fazama).
- `src/app/*` — rute (po jedna po stavci u `navStavke` iz `src/components/sidebar.tsx`).
- `src/app/api/cron/podsetnici/route.ts` — dnevni cron (zaštićen `CRON_SECRET`).

## Domenska pravila (Srbija)
- Akciza se plaća **po litru čistog (apsolutnog) alkohola**: `L × %vol/100`.
- Stopa je **podesiva** (`akciza_stopa`, verzionisana po `vazi_od`) — nikad hard-kodovana
  (~57.570 RSD/hl čistog alkohola u 2025, država je menja godišnje).
- Obračunski period je **polumesečni**: deo 1 = 1.–15., deo 2 = 16.–kraj meseca.
- **Akciza se obračunava pri PUNJENJU (flaširanju), ne pri prodaji** — svaki događaj punjenja u boce nosi akcizne markice (`amOd`/`amDo`) i osnov je `cistAlkoholL = litara × jačina lota/100`. Obračun agregira `punjenje` (gde je `proizvodId` postavljen) po periodu.
- Rok plaćanja (po praksi): deo 1 → poslednji dan istog meseca; deo 2 → 15. sledećeg meseca (`rokPolumesecni` u `src/lib/akciza.ts`). Obrazac **PP-OA**.
- **LOT (`destilati.oznaka`) je jedinstven** (UNIQUE) — ne može se dva puta uneti ista oznaka.

## Konvencije
- Drizzle `numeric` vraća **string** — koristi formatере iz `src/i18n/format.ts` za prikaz.
- Novi modul = nova rута u `src/app/`, stavka u `navStavke`, folder u `src/modules/`, stringovi u `sr.ts`.
- Stranice koje čitaju iz baze nose `export const dynamic = "force-dynamic"` (build okruženje ne dohvata bazu, pa nema statičkog prerendera).
- **Generički CRUD engine je `src/modules/crud/`** (koristi ga i Šifarnici i Proizvodnja, kasnije i ostale faze):
  - `tipovi.ts` — tipovi polja + zod (klijentski-bezbedno). `entiteti.ts` — `ENTITETI` registar metapodataka, svaki ima `osnovnaPutanja` (npr. `/sifarnici`, `/proizvodnja`).
  - `registar.ts` (`server-only`) — `TABELE` (Drizzle), `IZVORI_OPCIJA` (FK liste + kolona labele), `IZRACUNAJ` (izvedena polja: npr. `cistAlkoholL`, `qrKod`).
  - `akcije.ts` generičke `sacuvaj`/`obrisi`; `podaci.ts` `ucitajListu`/`ucitajOpcije`; `forma.tsx`/`tabela.tsx` generički UI.
  - Nov entitet = unos u `ENTITETI` + `TABELE` (+ `IZVORI_OPCIJA`/`IZRACUNAJ` po potrebi); dinamička ruta `/<sekcija>/[param]` + index sa `entitetiZaPutanju()` rade automatski.
- **Prijava (jedan nalog):** zaštićeni deo je u route-grupi `src/app/(app)/` (shell sa sidebar-om); root layout je prazan. `src/middleware.ts` štiti sve sem `/prijava`, `/api/cron` i statike — bez važeće sesije → `/prijava`. Sesija = potpisani HMAC kolačić (`src/lib/sesija.ts`), traje 90 dana („zapamti me"). Env: `APP_LOZINKA` (lozinka) + `SESIJA_TAJNA` (potpis). Odjava je u sidebar-u.
- **Storno** transakcionih tokova (prodaja/egalizacija/punjenje) vraća nuspojave (zalihe, količina suda); „izmena" = storno + ponovni unos. Sledljivost ima i lanac po lotu (`/sledljivost/lot/[oznaka]`) uz lanac po sudu (`/sledljivost/qr/[kod]`).
- **Tokovi van CRUD-a** (egalizacija, punjenje) su dedikovane statične rute (`/proizvodnja/egalizacija`, `/proizvodnja/punjenje`) — statičan segment ima prednost nad dinamičkim `[entitet]`. Upisi koji diraju više tabela idu kroz `db.transaction(...)`. Reset forme posle uspeha radi se u wrap-ovanoj akciji (ne u `useEffect` — ESLint `set-state-in-effect`).

## Status faza
- [x] **Faza 0 — Temelj:** skeleton, šema, i18n, app shell, PWA, domenska logika, cron stub.
- [x] **Faza 1 — Šifarnici:** descriptor-driven CRUD (proizvodi, kupci, dobavljači, vrste rakije, sredstva, akcizna stopa) + singleton podešavanja.
- [x] **Faza 2 — Proizvodnja & Sledljivost:** CRUD (sirovine, partije, destilati, sudovi) preko `crud` engine-a; egalizacija (transakcija → novi destilat) i punjenje (sud/boce + `magacin_promet`) kao dedikovani tokovi; sklapanje lanca u `src/modules/sledljivost/lanac.ts`, stranica `/sledljivost/qr/[kod]`; QR nalepnice (`qrcode`, print).
- [x] **Faza 3 — Magacin:** stanje boca iz `magacin_promet` (ulaz − izlaz) + rinfuz iz `sudovi.trenutnaKolicinaL`; alarmi niskih zaliha prema `pragNiskihZaliha` (`src/modules/magacin/stanje.ts`, `/magacin`).
- [x] **Faza 4 — Prodaja & Akcize:** prodaja (račun+stavke, lot+`destilatId`, snapshot jačine/cist alkohol, izlaz u `magacin_promet`); polumesečni obračun akcize (`src/modules/akcize`, `/akcize`) + PP-OA pregled (štampa); cron podsetnici za dospele akcize i niske zalihe (`/api/cron/podsetnici`, dedup, `CRON_SECRET`); `/obavestenja`. NAPOMENA: jačine SKU-ova su placeholder 40% (proveriti); akcizni PP-OA format se fino podešava kad stigne zvanični templejt.
- [~] **Faza 5 — Dashboard & Izveštaji:** Dashboard sa živim KPI (aktivne partije, boce na stanju, akciza tekući period, nova obaveštenja) + stubičasti grafikon prodaje po mesecima (`src/modules/dashboard`, `/`). PREOSTAJE: izveštaji + izvoz (PDF/Excel) — rade se kad stignu zvanični templejti.

> Ažuriraj status i konvencije ovde na kraju svake faze.
