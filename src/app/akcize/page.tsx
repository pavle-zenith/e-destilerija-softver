import { Placeholder } from "@/components/placeholder";
import { sr } from "@/i18n/sr";

export default function AkcizeStranica() {
  return (
    <Placeholder
      naslov={sr.nav.akcize}
      opis="Automatski obračun akcize po periodima (1–15 i 16–kraj) i podsetnici za rokove"
      faza="Faza 4"
    />
  );
}
