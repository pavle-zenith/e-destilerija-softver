import { Placeholder } from "@/components/placeholder";
import { sr } from "@/i18n/sr";

export default function SledljivostStranica() {
  return (
    <Placeholder
      naslov={sr.nav.sledljivost}
      opis="Istorija od sirovine do gotovog proizvoda i QR nalepnice"
      faza="Faza 2"
    />
  );
}
