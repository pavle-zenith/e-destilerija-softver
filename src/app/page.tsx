import { FlaskConical, Warehouse, Receipt, Bell } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { sr } from "@/i18n/sr";
import { broj, dinar } from "@/i18n/format";
import { ucitajKpi, ucitajProdajaPoMesecima } from "@/modules/dashboard/podaci";
import { StubicastiGrafikon } from "@/modules/dashboard/grafikon";

export const dynamic = "force-dynamic";

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

export default async function PregledStranica() {
  const [kpi, poMesecima] = await Promise.all([ucitajKpi(), ucitajProdajaPoMesecima()]);

  return (
    <div>
      <PageHeader naslov={sr.nav.pregled} opis={sr.pregledUI.opis} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiKartica labela={sr.pregledUI.aktivnePartije} vrednost={broj(kpi.aktivnePartije, 0)} ikona={FlaskConical} />
        <KpiKartica labela={sr.pregledUI.bocaNaStanju} vrednost={broj(kpi.bocaNaStanju, 0)} ikona={Warehouse} />
        <KpiKartica labela={sr.pregledUI.akcizaPeriod} vrednost={dinar(kpi.akcizaTekuciPeriod)} ikona={Receipt} />
        <KpiKartica labela={sr.pregledUI.novaObavestenja} vrednost={broj(kpi.novaObavestenja, 0)} ikona={Bell} />
      </div>

      <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {sr.pregledUI.prodajaPoMesecima}
        </h2>
        {poMesecima.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-400">{sr.pregledUI.nemaProdaje}</p>
        ) : (
          <StubicastiGrafikon podaci={poMesecima} />
        )}
      </div>
    </div>
  );
}
