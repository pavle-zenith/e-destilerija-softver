import { Placeholder } from "@/components/placeholder";
import { sr } from "@/i18n/sr";

export default function ProdajaStranica() {
  return (
    <Placeholder
      naslov={sr.nav.prodaja}
      opis="Evidencija prodaje sa automatskim umanjenjem zaliha"
      faza="Faza 4"
    />
  );
}
