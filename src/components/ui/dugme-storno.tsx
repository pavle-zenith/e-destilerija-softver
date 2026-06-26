"use client";

import { Trash2 } from "lucide-react";
import { sr } from "@/i18n/sr";
import { Dugme } from "./dugme";

/**
 * Storno dugme — poziva vezanu server akciju uz potvrdu.
 * `akcija` je već vezana na id (npr. stornirajProdaju.bind(null, id)).
 */
export function DugmeStorno({ akcija }: { akcija: () => Promise<void> }) {
  return (
    <form action={akcija}>
      <Dugme
        type="submit"
        varijanta="opasno"
        velicina="ikona"
        aria-label={sr.akcije.storniraj}
        title={sr.akcije.storniraj}
        onClick={(e) => {
          if (!window.confirm(sr.forma.potvrdaStorna)) e.preventDefault();
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Dugme>
    </form>
  );
}
