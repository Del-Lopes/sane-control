// Catálogo de serviços da Sane Control (do PERFIL-DO-NEGOCIO.md) usado pelo pipeline
// de vendas (serviço × cidade). Textos casam com as páginas /servicos/[slug].
export const SERVICES = [
  'Controle de Pragas',
  'Desinsetização',
  'Desratização',
  'Descupinização',
  "Higienização de Caixas d'Água",
  'Sanitização',
  'Limpeza de Estofados',
  'Desentupimento',
] as const

// Seleção determinística por data + slot (variedade entre dias e dentro do dia).
export function pickService(dateStr: string, slot: number): string {
  const seed = parseInt(dateStr.replace(/-/g, ''), 10)
  const idx = (seed + slot * 7) % SERVICES.length
  return SERVICES[idx]
}
