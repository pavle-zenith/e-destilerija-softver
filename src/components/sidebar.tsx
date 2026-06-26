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
  type LucideIcon,
} from "lucide-react";
import { sr } from "@/i18n/sr";
import { cn } from "@/lib/utils";

interface NavStavka {
  href: string;
  labela: string;
  ikona: LucideIcon;
}

/** Navigacione stavke (jedan izvor istine za rute i bočnu traku). */
export const navStavke: NavStavka[] = [
  { href: "/", labela: sr.nav.pregled, ikona: LayoutDashboard },
  { href: "/proizvodnja", labela: sr.nav.proizvodnja, ikona: FlaskConical },
  { href: "/sledljivost", labela: sr.nav.sledljivost, ikona: QrCode },
  { href: "/magacin", labela: sr.nav.magacin, ikona: Warehouse },
  { href: "/prodaja", labela: sr.nav.prodaja, ikona: ShoppingCart },
  { href: "/akcize", labela: sr.nav.akcize, ikona: Receipt },
  { href: "/izvestaji", labela: sr.nav.izvestaji, ikona: BarChart3 },
  { href: "/sifarnici", labela: sr.nav.sifarnici, ikona: BookMarked },
  { href: "/obavestenja", labela: sr.nav.obavestenja, ikona: Bell },
  { href: "/podesavanja", labela: sr.nav.podesavanja, ikona: Settings },
];

export function Sidebar() {
  const putanja = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-neutral-200 bg-white px-3 py-5 md:flex">
      <div className="px-3 pb-6">
        <p className="text-lg font-bold text-amber-900">{sr.app.naziv}</p>
        <p className="text-xs text-neutral-500">{sr.app.opis}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navStavke.map(({ href, labela, ikona: Ikona }) => {
          const aktivan = href === "/" ? putanja === "/" : putanja.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                aktivan
                  ? "bg-amber-100 text-amber-900"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
              )}
            >
              <Ikona className="h-4 w-4" />
              {labela}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
