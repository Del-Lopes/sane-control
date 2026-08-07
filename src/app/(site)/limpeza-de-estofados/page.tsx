/**
 * Landing page geral de higienização de estofados.
 *
 * O corpo vive em @/components/EstofadosLanding e é compartilhado com as
 * landings regionais; o que muda vem de @/lib/estofados-regioes.
 */

import { buildEstofadosMetadata, regiaoGeral } from "@/lib/estofados-regioes";
import EstofadosLanding from "@/components/EstofadosLanding";

export const metadata = buildEstofadosMetadata(regiaoGeral);

export default function LimpezaDeEstofadosPage() {
  return <EstofadosLanding regiao={regiaoGeral} />;
}
