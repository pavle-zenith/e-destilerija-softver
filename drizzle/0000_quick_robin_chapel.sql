CREATE TYPE "public"."status_akcize" AS ENUM('obracunato', 'placeno');--> statement-breakpoint
CREATE TYPE "public"."status_obavestenja" AS ENUM('novo', 'procitano', 'reseno');--> statement-breakpoint
CREATE TYPE "public"."tip_obavestenja" AS ENUM('akciza_rok', 'niske_zalihe', 'sistem');--> statement-breakpoint
CREATE TYPE "public"."tip_prometa" AS ENUM('ulaz', 'izlaz');--> statement-breakpoint
CREATE TYPE "public"."tip_suda" AS ENUM('bure', 'tank', 'cisterna', 'balon');--> statement-breakpoint
CREATE TABLE "akciza_stopa" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rsd_po_litru" numeric(12, 4) NOT NULL,
	"vazi_od" date NOT NULL,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dobavljaci" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"naziv" text NOT NULL,
	"pib" text,
	"maticni_broj" text,
	"adresa" text,
	"telefon" text,
	"email" text,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "enoloska_sredstva" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"naziv" text NOT NULL,
	"jedinica" text,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kupci" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"naziv" text NOT NULL,
	"pib" text,
	"maticni_broj" text,
	"adresa" text,
	"telefon" text,
	"email" text,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "podesavanja" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"naziv_firme" text,
	"pib" text,
	"maticni_broj" text,
	"adresa" text,
	"akciza_rok_dana" integer DEFAULT 15 NOT NULL,
	"podsetnik_dana" integer DEFAULT 3 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proizvodi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"naziv" text NOT NULL,
	"vrsta_rakije_id" uuid,
	"zapremina_l" numeric(8, 3) NOT NULL,
	"jacina" numeric(5, 2) NOT NULL,
	"barkod" text,
	"prag_niskih_zaliha" numeric(12, 3),
	"aktivan" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vrste_rakije" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"naziv" text NOT NULL,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "destilati" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"oznaka" text NOT NULL,
	"partija_id" uuid,
	"vrsta_rakije_id" uuid,
	"kolicina_l" numeric(12, 3) NOT NULL,
	"jacina" numeric(5, 2) NOT NULL,
	"cist_alkohol_l" numeric(12, 3),
	"datum" date,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "egalizacija" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"oznaka" text NOT NULL,
	"rezultat_destilat_id" uuid,
	"datum" date,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "egalizacija_ulazi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"egalizacija_id" uuid NOT NULL,
	"destilat_id" uuid NOT NULL,
	"kolicina_l" numeric(12, 3) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proizvodne_partije" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"oznaka" text NOT NULL,
	"sirovina_id" uuid,
	"vrsta_rakije_id" uuid,
	"datum_pocetka" date,
	"datum_kraja" date,
	"prinos_l" numeric(12, 3),
	"jacina" numeric(5, 2),
	"haccp_napomene" text,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sirovine" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"naziv" text NOT NULL,
	"dobavljac_id" uuid,
	"kolicina_kg" numeric(12, 2),
	"datum_prijema" date,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "upotreba_sredstava" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sredstvo_id" uuid NOT NULL,
	"partija_id" uuid,
	"destilat_id" uuid,
	"kolicina" numeric(12, 3),
	"datum" date,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "magacin_promet" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proizvod_id" uuid,
	"sud_id" uuid,
	"tip" "tip_prometa" NOT NULL,
	"kolicina" numeric(12, 3) NOT NULL,
	"referenca_tip" text,
	"referenca_id" uuid,
	"datum" date,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "punjenje" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"destilat_id" uuid NOT NULL,
	"sud_id" uuid,
	"proizvod_id" uuid,
	"kolicina_l" numeric(12, 3),
	"broj_jedinica" integer,
	"datum" date,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sudovi" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"oznaka" text NOT NULL,
	"tip" "tip_suda" DEFAULT 'bure' NOT NULL,
	"kapacitet_l" numeric(12, 3),
	"trenutna_kolicina_l" numeric(12, 3) DEFAULT '0' NOT NULL,
	"destilat_id" uuid,
	"qr_kod" text NOT NULL,
	"lokacija" text,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "sudovi_qr_kod_unique" UNIQUE("qr_kod")
);
--> statement-breakpoint
CREATE TABLE "prodaja" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"broj" text,
	"kupac_id" uuid,
	"datum" date NOT NULL,
	"ukupno_bez_akcize" numeric(14, 2),
	"ukupno_akciza" numeric(14, 2),
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prodaja_stavke" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prodaja_id" uuid NOT NULL,
	"proizvod_id" uuid NOT NULL,
	"kolicina" numeric(12, 3) NOT NULL,
	"zapremina_l" numeric(8, 3) NOT NULL,
	"jacina" numeric(5, 2) NOT NULL,
	"cist_alkohol_l" numeric(12, 3) NOT NULL,
	"cena_jedinice" numeric(14, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "akciza_obracun" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"godina" integer NOT NULL,
	"mesec" integer NOT NULL,
	"deo" integer NOT NULL,
	"period_od" date NOT NULL,
	"period_do" date NOT NULL,
	"litara_cistog_alkohola" numeric(14, 3) NOT NULL,
	"stopa" numeric(12, 4) NOT NULL,
	"iznos" numeric(14, 2) NOT NULL,
	"rok" date NOT NULL,
	"status" "status_akcize" DEFAULT 'obracunato' NOT NULL,
	"datum_placanja" date,
	"napomena" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "obavestenja" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tip" "tip_obavestenja" NOT NULL,
	"naslov" text NOT NULL,
	"poruka" text,
	"rok" date,
	"status" "status_obavestenja" DEFAULT 'novo' NOT NULL,
	"referenca_tip" text,
	"referenca_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proizvodi" ADD CONSTRAINT "proizvodi_vrsta_rakije_id_vrste_rakije_id_fk" FOREIGN KEY ("vrsta_rakije_id") REFERENCES "public"."vrste_rakije"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destilati" ADD CONSTRAINT "destilati_partija_id_proizvodne_partije_id_fk" FOREIGN KEY ("partija_id") REFERENCES "public"."proizvodne_partije"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "destilati" ADD CONSTRAINT "destilati_vrsta_rakije_id_vrste_rakije_id_fk" FOREIGN KEY ("vrsta_rakije_id") REFERENCES "public"."vrste_rakije"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "egalizacija" ADD CONSTRAINT "egalizacija_rezultat_destilat_id_destilati_id_fk" FOREIGN KEY ("rezultat_destilat_id") REFERENCES "public"."destilati"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "egalizacija_ulazi" ADD CONSTRAINT "egalizacija_ulazi_egalizacija_id_egalizacija_id_fk" FOREIGN KEY ("egalizacija_id") REFERENCES "public"."egalizacija"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "egalizacija_ulazi" ADD CONSTRAINT "egalizacija_ulazi_destilat_id_destilati_id_fk" FOREIGN KEY ("destilat_id") REFERENCES "public"."destilati"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proizvodne_partije" ADD CONSTRAINT "proizvodne_partije_sirovina_id_sirovine_id_fk" FOREIGN KEY ("sirovina_id") REFERENCES "public"."sirovine"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proizvodne_partije" ADD CONSTRAINT "proizvodne_partije_vrsta_rakije_id_vrste_rakije_id_fk" FOREIGN KEY ("vrsta_rakije_id") REFERENCES "public"."vrste_rakije"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sirovine" ADD CONSTRAINT "sirovine_dobavljac_id_dobavljaci_id_fk" FOREIGN KEY ("dobavljac_id") REFERENCES "public"."dobavljaci"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upotreba_sredstava" ADD CONSTRAINT "upotreba_sredstava_sredstvo_id_enoloska_sredstva_id_fk" FOREIGN KEY ("sredstvo_id") REFERENCES "public"."enoloska_sredstva"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upotreba_sredstava" ADD CONSTRAINT "upotreba_sredstava_partija_id_proizvodne_partije_id_fk" FOREIGN KEY ("partija_id") REFERENCES "public"."proizvodne_partije"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "upotreba_sredstava" ADD CONSTRAINT "upotreba_sredstava_destilat_id_destilati_id_fk" FOREIGN KEY ("destilat_id") REFERENCES "public"."destilati"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "magacin_promet" ADD CONSTRAINT "magacin_promet_proizvod_id_proizvodi_id_fk" FOREIGN KEY ("proizvod_id") REFERENCES "public"."proizvodi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "magacin_promet" ADD CONSTRAINT "magacin_promet_sud_id_sudovi_id_fk" FOREIGN KEY ("sud_id") REFERENCES "public"."sudovi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punjenje" ADD CONSTRAINT "punjenje_destilat_id_destilati_id_fk" FOREIGN KEY ("destilat_id") REFERENCES "public"."destilati"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punjenje" ADD CONSTRAINT "punjenje_sud_id_sudovi_id_fk" FOREIGN KEY ("sud_id") REFERENCES "public"."sudovi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "punjenje" ADD CONSTRAINT "punjenje_proizvod_id_proizvodi_id_fk" FOREIGN KEY ("proizvod_id") REFERENCES "public"."proizvodi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sudovi" ADD CONSTRAINT "sudovi_destilat_id_destilati_id_fk" FOREIGN KEY ("destilat_id") REFERENCES "public"."destilati"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prodaja" ADD CONSTRAINT "prodaja_kupac_id_kupci_id_fk" FOREIGN KEY ("kupac_id") REFERENCES "public"."kupci"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prodaja_stavke" ADD CONSTRAINT "prodaja_stavke_prodaja_id_prodaja_id_fk" FOREIGN KEY ("prodaja_id") REFERENCES "public"."prodaja"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prodaja_stavke" ADD CONSTRAINT "prodaja_stavke_proizvod_id_proizvodi_id_fk" FOREIGN KEY ("proizvod_id") REFERENCES "public"."proizvodi"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "podesavanja_singleton_idx" ON "podesavanja" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "akciza_period_idx" ON "akciza_obracun" USING btree ("godina","mesec","deo");