import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { db } from "@/db";
import { podesavanja } from "@/db/schema";
import { PodesavanjaForma, type PodesavanjaVrednosti } from "@/modules/podesavanja/forma";

// Podaci iz baze se čitaju po zahtevu — bez statičkog prerendera na build-u.
export const dynamic = "force-dynamic";

export default async function PodesavanjaStranica() {
  const [red] = await db.select().from(podesavanja).where(eq(podesavanja.id, 1)).limit(1);

  const vrednosti: PodesavanjaVrednosti = {
    nazivFirme: red?.nazivFirme ?? null,
    pib: red?.pib ?? null,
    maticniBroj: red?.maticniBroj ?? null,
    adresa: red?.adresa ?? null,
    akcizaRokDana: red?.akcizaRokDana ?? 15,
    podsetnikDana: red?.podsetnikDana ?? 3,
  };

  return (
    <div>
      <PageHeader naslov={sr.nav.podesavanja} opis="Podaci o firmi i parametri obračuna akcize" />
      <PodesavanjaForma vrednosti={vrednosti} />
    </div>
  );
}
