/**
 * Serviços reais oferecidos pela Sane Control.
 * Textos alinhados ao brief da cliente (Novo Site 2026) e à RDC 622/2022 da ANVISA.
 *
 * COMPLIANCE (obrigatório):
 *  - Proibido: "seguro", "atóxico", "inócuo", "produto natural", "sem riscos".
 *  - Obrigatório: "baixa toxicidade", "Manejo Integrado de Pragas (MIP)",
 *    "segurança operacional", "saneantes".
 */

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string; // emoji simples usado como ícone (sem dependência externa)
  image?: string; // foto real da equipe (public/images) — EPIs visíveis
  description: string;
  highlights: { title: string; text: string }[];
  // Slider antes/depois (brief — atualmente usado em Estofados).
  // ⚠️ before/after apontam para placeholders — substituir por fotos reais.
  beforeAfter?: { before: string; after: string };
};

export const services: Service[] = [
  {
    slug: "controle-de-pragas",
    title: "Controle de Pragas (Dedetização)",
    short: "Manejo Integrado de Pragas contra insetos, roedores e cupins, com equipe própria e saneantes de baixa toxicidade.",
    icon: "🛡️",
    image: "/images/controle-de-pragas.jpeg",
    description:
      "Desde 2009, a Sane Control cuida da saúde do seu lar ou empresa. Unimos tecnologia ao Manejo Integrado de Pragas (MIP) para oferecer um controle eficaz, em conformidade com as Boas Práticas Operacionais da ANVISA (RDC 622/2022). Nosso método não foca apenas na aplicação de saneantes, mas no gerenciamento completo do ambiente — identificamos as causas do problema para agir na raiz, priorizando ações preventivas e o uso consciente de recursos.",
    highlights: [
      {
        title: "Técnicas precisas e localizadas",
        text: "Iscas em gel discretas para cozinhas e áreas sensíveis, pulverização direcionada em frestas e esconderijos, além de barreiras e monitoramento contínuo.",
      },
      {
        title: "Proteção para a família e pets",
        text: "Utilizamos saneantes modernos, priorizando formulações de baixa toxicidade e alta seletividade, com orientação sobre o tempo de retorno ao ambiente.",
      },
      {
        title: "Pragas atendidas",
        text: "Baratas, formigas, percevejos, pulgas, aranhas, escorpiões, moscas e mosquitos, em ambientes internos e externos.",
      },
    ],
  },
  {
    slug: "desinsetizacao",
    title: "Desinsetização",
    short: "Controle de insetos rasteiros e voadores com Manejo Integrado de Pragas e saneantes de baixa toxicidade.",
    icon: "🐜",
    image: "/images/desinsetizacao.jpeg",
    description:
      "O Manejo Integrado de Pragas auxilia na prevenção e no controle das diversas espécies de insetos rasteiros e voadores. Utilizamos saneantes de baixa toxicidade, aplicados por profissionais capacitados em biossegurança de acordo com cada tipo de infestação, sempre com segurança operacional e conformidade com a RDC 622/2022 da ANVISA.",
    highlights: [
      {
        title: "Pulverização direcionada",
        text: "Aplicação estratégica de saneantes em rodapés, frestas e pontos críticos para o controle de insetos rasteiros.",
      },
      {
        title: "Iscas em gel",
        text: "Aplicação discreta em frestas e fendas para o controle de baratas e formigas, sem interromper a rotina do ambiente.",
      },
      {
        title: "Insetos voadores",
        text: "Nebulização e atomização para o controle de mosquitos, moscas e outros insetos voadores.",
      },
    ],
  },
  {
    slug: "desratizacao",
    title: "Desratização",
    short: "Controle de roedores com porta-iscas com chave, iscas de alta atratividade e barreiras físicas.",
    icon: "🐀",
    image: "/images/desratizacao.jpeg",
    description:
      "Ratos e camundongos representam riscos sérios à saúde e à estrutura do seu patrimônio. O controle de roedores exige mais do que a aplicação de saneantes: requer o estudo do comportamento da praga. Seguimos as Boas Práticas Operacionais da ANVISA, garantindo que o Manejo Integrado de Pragas seja feito de forma técnica e responsável, com documentação essencial para empresas e condomínios em dia com a Vigilância Sanitária.",
    highlights: [
      {
        title: "Porta-iscas com chave",
        text: "Dispositivos de segurança (PPE) que impedem o acesso de crianças ou pets ao conteúdo interno.",
      },
      {
        title: "Iscas de alta atratividade",
        text: "Formulações modernas que atraem os roedores de forma eficaz, agindo sobre a colônia.",
      },
      {
        title: "Barreiras físicas",
        text: "Identificação e orientação sobre o fechamento de frestas, ralos e vãos. Atendemos ratazanas, ratos de telhado e camundongos.",
      },
    ],
  },
  {
    slug: "descupinizacao",
    title: "Descupinização",
    short: "Eliminação de colônias de cupins com sistema de iscas e barreira química, preservando o patrimônio.",
    icon: "🪵",
    image: "/images/descupinizacao.jpeg",
    description:
      "Cupins podem causar danos estruturais severos antes mesmo de serem notados. O controle de cupins exige conhecimento profundo da biologia de cada espécie. Nossa equipe segue rigorosamente as Boas Práticas Operacionais da ANVISA (RDC 622/2022), utilizando tecnologia para identificar focos e aplicar a estratégia correta. Emitimos o Comprovante de Execução de Serviço com dados do Responsável Técnico.",
    highlights: [
      {
        title: "Sistema de iscas Cupinout®",
        text: "Para cupins subterrâneos (Coptotermes gestroi e Heterotermes spp.), elimina a colônia pela raiz sem perfurações nem interdição do local.",
      },
      {
        title: "Barreira química e injeção em madeira",
        text: "Aplicação estratégica no solo e em pontos críticos, além da proteção direta de móveis, forros e guarnições.",
      },
      {
        title: "Tratamento de condutes",
        text: "Bloqueio das rotas de passagem pela rede elétrica. Atendemos cupim de madeira seca, cupim subterrâneo e brocas de madeira.",
      },
    ],
  },
  {
    slug: "manejo-de-pombos",
    title: "Manejo de Pombos",
    short: "Sistema eletromagnético de repulsão que impede o pouso de pombos, com respeito à natureza.",
    icon: "🕊️",
    image: "/images/manejo-de-pombos.jpeg",
    description:
      "Oferecemos um sistema exclusivo de manejo de pombos que gera um campo eletromagnético imperceptível para humanos e outros animais, mas que impede o pouso das aves. Uma solução tecnológica e sustentável para a proteção de patrimônio, com respeito à natureza e conformidade técnica.",
    highlights: [
      {
        title: "Alta eficácia",
        text: "Redução drástica da presença de aves no local, com eficácia de até 100%.",
      },
      {
        title: "Sustentável e silencioso",
        text: "Baixo consumo de energia e operação totalmente silenciosa.",
      },
      {
        title: "Estética preservada",
        text: "Instalação discreta que não interfere na fachada do imóvel.",
      },
    ],
  },
  {
    slug: "higienizacao-caixa-dagua",
    title: "Higienização de Reservatórios (Caixas d'Água)",
    short: "Limpeza e desinfecção de reservatórios com saneantes de baixa toxicidade para água de qualidade.",
    icon: "💧",
    image: "/images/equipe-veiculo.jpeg",
    description:
      "Água pura e saúde para a sua família. Realizamos a higienização de reservatórios com protocolo técnico de limpeza e desinfecção, essencial para garantir a qualidade da água consumida em residências, condomínios e empresas em São Paulo, Caieiras e Região.",
    highlights: [
      {
        title: "Esgotamento e limpeza mecânica",
        text: "Remoção de lodo, lama e detritos das paredes e do fundo do reservatório.",
      },
      {
        title: "Desinfecção química",
        text: "Utilização de saneantes específicos de baixa toxicidade para a eliminação de bactérias.",
      },
      {
        title: "Inspeção de integridade",
        text: "Verificação de boias, tampas e rachaduras, com registro do serviço para controle sanitário.",
      },
    ],
  },
  {
    slug: "sanitizacao",
    title: "Sanitização de Ambientes",
    short: "Nebulização UBV com saneantes de baixa toxicidade para a biossegurança de ambientes.",
    icon: "🧴",
    image: "/images/sanitizacao.jpeg",
    description:
      "Biossegurança para quem você ama. Utilizamos o método de Nebulização de Ultra Baixo Volume (UBV), que permite que o saneante alcance locais onde a limpeza manual não chega, como dutos de ar e frestas. Ideal para residências, escolas, restaurantes e empresas que exigem alto padrão de higiene.",
    highlights: [
      {
        title: "Nebulização UBV",
        text: "Cobertura uniforme de superfícies e ambientes de difícil acesso, como dutos de ar e frestas.",
      },
      {
        title: "Ambientes coletivos",
        text: "Escolas, clínicas, restaurantes e áreas de grande circulação que exigem alto padrão de higiene.",
      },
      {
        title: "Baixa toxicidade",
        text: "Saneantes adequados que permitem o retorno ao ambiente com segurança operacional.",
      },
    ],
  },
  {
    slug: "limpeza-de-estofados",
    title: "Higienização e Impermeabilização de Estofados",
    short: "Extração por sucção, ação sanitizante e barreira invisível contra líquidos e manchas.",
    icon: "🛋️",
    image: "/images/sanitizacao-veiculo.jpeg",
    description:
      "Saúde e renovação para o seu ambiente. Nosso protocolo de limpeza e proteção total remove sujeira incrustada, ácaros e agentes que causam alergias respiratórias, além de aplicar uma camada de impermeabilização que protege o tecido no dia a dia.",
    highlights: [
      {
        title: "Extração por sucção",
        text: "Remoção da sujeira incrustada, ácaros e resíduos com equipamento de extração.",
      },
      {
        title: "Ação sanitizante",
        text: "Agente desinfetante com laudo de garantia, contribuindo para um ambiente mais saudável.",
      },
      {
        title: "Impermeabilização",
        text: "Barreira invisível contra líquidos e manchas, prolongando a vida útil do estofado.",
      },
    ],
    beforeAfter: {
      before: "/images/estofado-antes.svg",
      after: "/images/estofado-depois.svg",
    },
  },
  {
    slug: "desentupimento",
    title: "Desentupimento & PPA Sane",
    short: "Desentupimento com fluxo livre e o PPA Sane — Plano de Prevenção de Alagamento com limpeza programada.",
    icon: "🔧",
    image: "/images/equipe-atendimento.jpeg",
    description:
      "Fluxo livre e sem preocupações. Realizamos o desentupimento de tubulações, poços pluviais e caixas de gordura, resolvendo obstruções com agilidade. Também oferecemos o PPA Sane — Plano de Prevenção de Alagamento Sane, nosso serviço de manutenção preventiva desenhado para evitar transtornos com chuvas ou falhas no sistema de esgoto por meio de limpeza programada e escoamento garantido.",
    highlights: [
      {
        title: "Desentupimento ágil",
        text: "Desobstrução de tubulações residenciais e comerciais com cabos espirais rotativos e bombas de sucção.",
      },
      {
        title: "PPA Sane — prevenção de alagamento",
        text: "Plano de manutenção preventiva com limpeza programada para evitar alagamentos em períodos de chuva.",
      },
      {
        title: "Escoamento garantido",
        text: "Limpeza de poços pluviais e caixas de gordura, com orientação para evitar novas obstruções.",
      },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const differentials: { title: string; text: string; icon: string }[] = [
  { icon: "🔬", title: "Manejo Integrado de Pragas", text: "Gerenciamos o ambiente de forma inteligente e sustentável, agindo na raiz do problema — não apenas aplicando saneantes." },
  { icon: "📋", title: "Rigor normativo", text: "Operamos com licenças plenas da Vigilância Sanitária, em conformidade com a RDC 622/2022 da ANVISA." },
  { icon: "🧪", title: "Saneantes de baixa toxicidade", text: "Tecnologia seletiva que prioriza a segurança operacional de crianças, idosos e animais de estimação." },
  { icon: "👷", title: "Equipe própria e capacitada", text: "Profissionais próprios, com treinamento contínuo em biossegurança e novas tecnologias de controle ambiental." },
];

export const segments: { title: string; text: string; icon: string }[] = [
  { icon: "🏠", title: "Residencial", text: "Proteção completa para casas e apartamentos, com atenção ao bem-estar de toda a família." },
  { icon: "🏢", title: "Condomínios", text: "Planos de controle contínuo para áreas comuns e coletivas, com documentação para a Vigilância Sanitária." },
  { icon: "🏭", title: "Industrial", text: "Conformidade sanitária e Manejo Integrado de Pragas para indústrias e grandes estruturas." },
  { icon: "🏫", title: "Escolas", text: "Ambientes higienizados para alunos e colaboradores, com saneantes de baixa toxicidade." },
  { icon: "🏥", title: "Hospitais e clínicas", text: "Padrões rigorosos de sanitização e biossegurança para áreas de saúde." },
];
