import { sr } from "@/i18n/sr";
import { PrijavaForma } from "@/modules/auth/forma";

export const dynamic = "force-dynamic";

export default function PrijavaStranica() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <p className="text-xl font-bold text-indigo-900">{sr.app.naziv}</p>
          <p className="mt-1 text-sm text-neutral-500">{sr.auth.naslov}</p>
        </div>
        <PrijavaForma />
      </div>
    </div>
  );
}
