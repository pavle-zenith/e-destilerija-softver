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
- Rok plaćanja = kraj perioda + `akcizaRokDana` (podrazumevano 15). Obrazac **PP-OA**.

## Konvencije
- Drizzle `numeric` vraća **string** — koristi formatере iz `src/i18n/format.ts` za prikaz.
- Novi modul = nova rута u `src/app/`, stavka u `navStavke`, folder u `src/modules/`, stringovi u `sr.ts`.

## Status faza
- [x] **Faza 0 — Temelj:** skeleton, šema, i18n, app shell, PWA, domenska logika, cron stub.
- [ ] **Faza 1 — Šifarnici:** CRUD (proizvodi, kupci, dobavljači, vrste rakije, sredstva, akcizna stopa, podešavanja).
- [ ] **Faza 2 — Proizvodnja & Sledljivost:** partije, egalizacija, punjenje, istorija lota, QR nalepnice.
- [ ] **Faza 3 — Magacin:** stanje iz prometa, alarmi za niske zalihe.
- [ ] **Faza 4 — Prodaja & Akcize:** prodaja → zalihe → obračun akcize → podsetnici (cron).
- [ ] **Faza 5 — Dashboard & Izveštaji:** KPI, grafikoni, izvoz (PDF/Excel).

> Ažuriraj status i konvencije ovde na kraju svake faze.
