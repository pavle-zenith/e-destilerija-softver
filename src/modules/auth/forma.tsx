"use client";

import { useActionState } from "react";
import { sr } from "@/i18n/sr";
import { Dugme } from "@/components/ui/dugme";
import { prijaviSe } from "./akcije";

export function PrijavaForma() {
  const [stanje, formAction, pending] = useActionState(prijaviSe, { ok: false });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="lozinka" className="mb-1 block text-sm font-medium text-neutral-700">
          {sr.auth.lozinka}
        </label>
        <input
          id="lozinka"
          name="lozinka"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      {stanje.poruka ? <p className="text-sm text-red-600">{stanje.poruka}</p> : null}
      <Dugme type="submit" disabled={pending} className="w-full">
        {pending ? sr.stanje.ucitavanje : sr.auth.prijaviSe}
      </Dugme>
    </form>
  );
}
