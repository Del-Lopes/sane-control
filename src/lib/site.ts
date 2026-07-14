/**
 * Dados reais da Sane Control — fonte única de verdade.
 * Extraído do site atual (sanecontrol.com.br) para manter fidelidade ao negócio.
 */

export const site = {
  name: "Sane Control",
  legalName: "Sane Control Saneamento Ambiental Ltda.",
  tagline: "Especialistas em Saúde Ambiental e Proteção de Patrimônio",
  foundedYear: 2009,
  description:
    "Empresa de saneamento ambiental especializada em Manejo Integrado de Pragas (MIP), higienização de reservatórios de água, sanitização de ambientes, desentupimento e higienização de estofados. Atendemos residências, condomínios, escolas, hospitais e empresas em São Paulo e Região Metropolitana, em conformidade com a RDC 622/2022 da ANVISA.",
  serviceArea: "São Paulo e Região Metropolitana",
  city: "Caieiras",
  state: "SP",
  // Contato real (WhatsApp extraído do site atual)
  whatsapp: {
    display: "(11) 96198-4360",
    number: "5511961984360",
  },
  phoneHours: "Segunda a sexta, das 7h às 17h. Atendimento noturno e aos domingos sob agendamento.",
  registrations: [
    "Licença de Funcionamento ANVISA",
    "Registro Municipal (Prefeitura de Caieiras) nº 9081",
    "Conselho Regional de Química — ART 9135",
    "PPRA — Programa de Prevenção de Riscos Ambientais",
    "PCMSO — Controle Médico de Saúde Ocupacional",
    "NR-33 — Trabalho em Espaços Confinados",
    "NR-35 — Trabalho em Altura",
  ],
  // Rodapé obrigatório (RDC 622/2022) — dados reais fornecidos pela cliente.
  legal: {
    razaoSocial: "Sane Control Saneamento Ambiental Ltda.",
    cnpj: "11.204.710/0001-50",
    address: "Rua Alcides Banhe, 166 — Caieiras/SP",
    sanitaryLicenses: [
      "Licença da Vigilância Sanitária nº 350900701-812-000016-1-9",
    ],
  },
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const yearsInMarket = (): number => new Date().getFullYear() - site.foundedYear;
