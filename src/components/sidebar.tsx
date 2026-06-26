"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FlaskConical,
  QrCode,
  Warehouse,
  ShoppingCart,
  Receipt,
  BarChart3,
  BookMarked,
  Settings,
  Bell,
  LogOut,
  Grape,
  type LucideIcon,
} from "lucide-react";
import { sr } from "@/i18n/sr";
import { cn } from "@/lib/utils";
import { odjava } from "@/modules/auth/akcije";

interface NavStavka {
  href: string;
  labela: string;
  ikona: LucideIcon;
}
interface NavGrupa {
  naslov: string;
  stavke: NavStavka[];
}

/** Navigacija grupisana po sekcijama (jedan izvor istine za rute i bočnu traku). */
export const navGrupe: NavGrupa[] = [
  {
    naslov: "Glavno",
    stavke: [{ href: "/", labela: sr.nav.pregled, ikona: LayoutDashboard }],
  },
  {
    naslov: sr.nav.proizvodnja,
    stavke: [
      { href: "/proizvodnja", labela: sr.nav.proizvodnja, ikona: FlaskConical },
      { href: "/sledljivost", labela: sr.nav.sledljivost, ikona: QrCode },
      { href: "/magacin", labela: sr.nav.magacin, ikona: Warehouse },
    ],
  },
  {
    naslov: sr.nav.prodaja,
    stavke: [
      { href: "/prodaja", labela: sr.nav.prodaja, ikona: ShoppingCart },
      { href: "/akcize", labela: sr.nav.akcize, ikona: Receipt },
      { href: "/izvestaji", labela: sr.nav.izvestaji, ikona: BarChart3 },
    ],
  },
  {
    naslov: "Podešavanja",
    stavke: [
      { href: "/sifarnici", labela: sr.nav.sifarnici, ikona: BookMarked },
      { href: "/obavestenja", labela: sr.nav.obavestenja, ikona: Bell },
      { href: "/podesavanja", labela: sr.nav.podesavanja, ikona: Settings },
    ],
  },
];

export function Sidebar() {
  const putanja = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-neutral-200/80 bg-white px-3 py-5 md:flex print:hidden">
      <div className="flex items-center gap-2.5 px-2 pb-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm">
          <Grape className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-base font-bold text-neutral-900">{sr.app.naziv}</p>
          <p className="text-[11px] text-neutral-400">{sr.app.opis}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-5 overflow-y-auto">
        {navGrupe.map((grupa) => (
          <div key={grupa.naslov}>
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {grupa.naslov}
            </p>
            <div className="flex flex-col gap-0.5">
              {grupa.stavke.map(({ href, labela, ikona: Ikona }) => {
                const aktivan = href === "/" ? putanja === "/" : putanja.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      aktivan
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                    )}
                  >
                    <Ikona className={cn("h-[18px] w-[18px]", aktivan ? "text-indigo-600" : "text-neutral-400")} />
                    {labela}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <form action={odjava} className="mt-2 border-t border-neutral-200/80 pt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <LogOut className="h-[18px] w-[18px] text-neutral-400" />
          {sr.auth.odjava}
        </button>
      </form>
    </aside>
  );
}
