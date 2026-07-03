/**
 * Dados reais da Sane Control — fonte única de verdade.
 * Extraído do site atual (sanecontrol.com.br) para manter fidelidade ao negócio.
 */

export const site = {
  name: "Sane Control",
  legalName: "Sane Control Controle de Pragas",
  tagline: "Compromisso com a segurança e manutenção do seu lar",
  foundedYear: 2006,
  description:
    "Empresa especializada em controle de pragas, higienização de reservatórios de água, sanitização de ambientes, desentupimentos e limpeza de tubulação. Atendemos residências, condomínios, escolas, hospitais e empresas em São Paulo e região metropolitana.",
  serviceArea: "São Paulo e região metropolitana",
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
} as const;

export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsapp.number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const yearsInMarket = (): number => new Date().getFullYear() - site.foundedYear;
