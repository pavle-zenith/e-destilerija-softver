import { FlaskConical, Warehouse, Receipt, Bell } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";

interface KpiKarticaProps {
  labela: string;
  vrednost: string;
  ikona: React.ComponentType<{ className?: string }>;
}

function KpiKartica({ labela, vrednost, ikona: Ikona }: KpiKarticaProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500">{labela}</p>
        <Ikona className="h-5 w-5 text-amber-500" />
      </div>
      <p className="mt-3 text-2xl font-bold text-neutral-900">{vrednost}</p>
    </div>
  );
}

export default function PregledStranica() {
  // Vrednosti su trenutno mock — povezuju se sa bazom u Fazama 3–5.
  return (
    <div>
      <PageHeader naslov={sr.nav.pregled} opis="Brzi pregled stanja destilerije" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiKartica labela="Aktivne partije" vrednost="—" ikona={FlaskConical} />
        <KpiKartica labela="Proizvodi na zalihama" vrednost="—" ikona={Warehouse} />
        <KpiKartica labela="Akciza — tekući period" vrednost="—" ikona={Receipt} />
        <KpiKartica labela="Nova obaveštenja" vrednost="—" ikona={Bell} />
      </div>
      <p className="mt-8 text-sm text-neutral-400">
        Podaci i grafikoni se aktiviraju kako se moduli budu povezivali sa bazom (Faze 3–5).
      </p>
    </div>
  );
}
