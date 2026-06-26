import { broj } from "@/i18n/format";
import type { MesecnaProdaja } from "./podaci";

/** Jednostavan stubičasti grafikon (bez spoljnih biblioteka). */
export function StubicastiGrafikon({ podaci }: { podaci: MesecnaProdaja[] }) {
  const max = Math.max(1, ...podaci.map((d) => d.vrednost));
  return (
    <div className="flex h-48 items-end gap-2 overflow-x-auto">
      {podaci.map((d, i) => (
        <div key={i} className="flex min-w-10 flex-1 flex-col items-center gap-1">
          <span className="text-[10px] text-neutral-400">{broj(d.vrednost, 1)}</span>
          <div
            className="w-full rounded-t bg-indigo-500/80"
            style={{ height: `${Math.max(2, (d.vrednost / max) * 100)}%` }}
            title={`${d.labela}: ${broj(d.vrednost, 3)} L`}
          />
          <span className="text-[10px] text-neutral-500">{d.labela}</span>
        </div>
      ))}
    </div>
  );
}
