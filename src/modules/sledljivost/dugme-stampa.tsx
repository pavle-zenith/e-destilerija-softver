"use client";

import { Printer } from "lucide-react";
import { sr } from "@/i18n/sr";
import { Dugme } from "@/components/ui/dugme";

export function DugmeStampa() {
  return (
    <Dugme onClick={() => window.print()}>
      <Printer className="h-4 w-4" />
      {sr.sledljivostUI.odstampaj}
    </Dugme>
  );
}
