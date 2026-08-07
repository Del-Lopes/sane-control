/**
 * Landing regional — Caieiras e cidades vizinhas.
 * Conteúdo local (umidade da serra, quintal, base na cidade) em @/lib/estofados-regioes.
 */

import { buildEstofadosMetadata, regiaoCaieiras } from "@/lib/estofados-regioes";
import EstofadosLanding from "@/components/EstofadosLanding";

export const metadata = buildEstofadosMetadata(regiaoCaieiras);

export default function LimpezaDeEstofadosCaieirasPage() {
  return <EstofadosLanding regiao={regiaoCaieiras} />;
}
