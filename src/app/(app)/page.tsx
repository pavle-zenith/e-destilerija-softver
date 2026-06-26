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
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Ikona className="h-4 w-4" />
        </span>
        <p className="text-sm font-medium text-neutral-500">{labela}</p>
      </div>
      <p className="mt-3 text-3xl font-bold tracking-tight text-neutral-900">{vrednost}</p>
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

      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-5">
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
