import { Placeholder } from "@/components/placeholder";
import { sr } from "@/i18n/sr";

export default function MagacinStranica() {
  return (
    <Placeholder
      naslov={sr.nav.magacin}
      opis="Zalihe u realnom vremenu i alarmi za niske zalihe"
      faza="Faza 3"
    />
  );
}
