/**
 * Landing regional — São Paulo capital, com foco em Moema e Zona Sul.
 * Conteúdo local (ângulo de apartamento, bairros, FAQs) em @/lib/estofados-regioes.
 */

import { buildEstofadosMetadata, regiaoSaoPaulo } from "@/lib/estofados-regioes";
import EstofadosLanding from "@/components/EstofadosLanding";

export const metadata = buildEstofadosMetadata(regiaoSaoPaulo);

export default function LimpezaDeEstofadosSaoPauloPage() {
  return <EstofadosLanding regiao={regiaoSaoPaulo} />;
}
