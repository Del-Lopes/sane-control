/**
 * Serviços reais oferecidos pela Sane Control.
 * Textos baseados no conteúdo do site atual.
 */

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: string; // emoji simples usado como ícone (sem dependência externa)
  description: string;
  highlights: { title: string; text: string }[];
};

export const services: Service[] = [
  {
    slug: "controle-de-pragas",
    title: "Controle de Pragas",
    short: "Solução completa contra insetos, roedores e cupins, com equipe própria e produtos de baixo impacto.",
    icon: "🛡️",
    description:
      "Oferecemos um programa completo de controle de pragas urbanas, reunindo desinsetização, desratização e descupinização em um único plano de proteção. Cada atendimento é feito por profissionais qualificados, com produtos de baixo impacto ambiental e monitoramento após o serviço, garantindo a segurança de residências, condomínios, escolas, hospitais e empresas.",
    highlights: [
      {
        title: "Desinsetização",
        text: "Controle de insetos rasteiros e voadores — baratas, formigas, mosquitos e moscas — com pulverização, gel e nebulização.",
      },
      {
        title: "Desratização",
        text: "Controle de roedores com estações porta-iscas seguras e monitoramento profissional contínuo.",
      },
      {
        title: "Descupinização",
        text: "Combate a cupins de madeira seca, subterrâneos e arborícolas, com ações corretivas e preventivas.",
      },
    ],
  },
  {
    slug: "desinsetizacao",
    title: "Desinsetização",
    short: "Controle de insetos rasteiros e voadores com produtos de baixo impacto.",
    icon: "🐜",
    description:
      "O tratamento realizado nos ambientes auxilia na prevenção e mantém a saúde protegida das diversas espécies de insetos rasteiros e voadores. Utilizamos produtos de baixo impacto ambiental, aplicados por profissionais qualificados de acordo com cada tipo de infestação.",
    highlights: [
      {
        title: "Desinsetização líquida / pulverização",
        text: "Combate a insetos rasteiros por meio de spray orgânico diluído em água, aplicado em rodapés e pontos estratégicos.",
      },
      {
        title: "Desinsetização em gel",
        text: "Aplicação de iscas em frestas e fendas para o controle de baratas e formigas, sem interromper a rotina do ambiente.",
      },
      {
        title: "Insetos voadores",
        text: "Atomização e termonebulização para o controle de mosquitos, moscas e outros insetos voadores.",
      },
    ],
  },
  {
    slug: "desratizacao",
    title: "Desratização",
    short: "Controle de roedores com medidas preventivas, corretivas e monitoramento.",
    icon: "🐀",
    description:
      "Controle de roedores por meio de medidas preventivas e corretivas, com a instalação de estações porta-iscas trancadas e seguras, além de monitoramento profissional contínuo para garantir a eliminação e evitar novas infestações.",
    highlights: [
      { title: "Estações porta-iscas", text: "Instalação de estações trancadas, seguras para pessoas e animais domésticos." },
      { title: "Monitoramento", text: "Acompanhamento periódico e reposição de iscas conforme a necessidade." },
      { title: "Ações preventivas", text: "Identificação de pontos de acesso e orientação para bloqueio de entradas." },
    ],
  },
  {
    slug: "descupinizacao",
    title: "Descupinização",
    short: "Combate a cupins de madeira seca, subterrâneos e arborícolas.",
    icon: "🪵",
    description:
      "Sistema de ações para combater cupins de madeira seca, subterrâneos e arborícolas. Aliamos ações corretivas e preventivas a produtos de alto desempenho, protegendo estruturas de madeira, móveis e o patrimônio do imóvel.",
    highlights: [
      { title: "Madeira seca", text: "Tratamento localizado em móveis e estruturas afetadas." },
      { title: "Subterrâneos", text: "Barreiras químicas no solo para proteção da edificação." },
      { title: "Preventivo", text: "Aplicação em madeiramentos novos e áreas de risco." },
    ],
  },
  {
    slug: "higienizacao-caixa-dagua",
    title: "Higienização de Caixas d'Água",
    short: "Limpeza de reservatórios com escovação e desinfecção, sem desperdício.",
    icon: "💧",
    description:
      "Limpeza de reservatórios com esgotamento, escovação das paredes e aplicação de hipoclorito de sódio para a eliminação de bactérias. Um serviço essencial para garantir a qualidade da água consumida em residências e empresas.",
    highlights: [
      { title: "Escovação completa", text: "Remoção de resíduos e sujidades das paredes e fundo do reservatório." },
      { title: "Desinfecção", text: "Aplicação de produto adequado para eliminação de bactérias." },
      { title: "Relatório", text: "Registro do serviço para controle sanitário e vistorias." },
    ],
  },
  {
    slug: "sanitizacao",
    title: "Sanitização",
    short: "Desinfecção de ambientes contra fungos, bactérias e vírus.",
    icon: "🧴",
    description:
      "Tratamento desinfetante por nebulização para controlar fungos, bactérias e vírus em residências, escolas, restaurantes e empresas. Ideal para ambientes que exigem alto padrão de higiene e segurança.",
    highlights: [
      { title: "Nebulização", text: "Cobertura uniforme de superfícies e ambientes de difícil acesso." },
      { title: "Ambientes coletivos", text: "Escolas, clínicas, restaurantes e áreas de grande circulação." },
      { title: "Baixo impacto", text: "Produtos adequados que permitem o rápido retorno ao ambiente." },
    ],
  },
  {
    slug: "limpeza-de-estofados",
    title: "Limpeza de Estofados",
    short: "Higienização profunda de sofás, poltronas, colchões e cadeiras.",
    icon: "🛋️",
    description:
      "Higienização profunda de estofados em geral — sofás, poltronas, colchões, cadeiras e cabeceiras. O processo remove ácaros, fungos, manchas e odores, contribuindo para um ambiente mais limpo, saudável e livre de agentes que causam alergias respiratórias.",
    highlights: [
      { title: "Extração profunda", text: "Remoção de sujeira impregnada, ácaros e resíduos com equipamento de extração." },
      { title: "Antimanchas e odores", text: "Tratamento que ajuda a eliminar manchas e neutralizar odores do tecido." },
      { title: "Secagem rápida", text: "Processo que permite o retorno ao uso em pouco tempo, sem encharcar o estofado." },
    ],
  },
  {
    slug: "desentupimento",
    title: "Desentupimento",
    short: "Limpeza de tubulações, poços pluviais e caixas de gordura.",
    icon: "🔧",
    description:
      "Limpeza de tubulações, poços pluviais e caixas de gordura por meio de cabos espirais rotativos e bombas de sucção. Resolvemos entupimentos com agilidade, evitando transtornos e prejuízos ao imóvel.",
    highlights: [
      { title: "Cabos rotativos", text: "Desobstrução de tubulações residenciais e comerciais." },
      { title: "Sucção", text: "Limpeza de poços pluviais e caixas de gordura." },
      { title: "Prevenção", text: "Orientação para evitar novos entupimentos." },
    ],
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const differentials: { title: string; text: string; icon: string }[] = [
  { icon: "🌿", title: "Produtos de baixo impacto", text: "Inseticidas orgânicos que respeitam o meio ambiente e a saúde da sua família." },
  { icon: "💧", title: "Caixa d'água sem esvaziar", text: "Higienização do reservatório sem desperdício de água." },
  { icon: "👷", title: "Equipe própria", text: "Profissionais treinados e registrados, sem terceirização, com frota própria." },
  { icon: "🔎", title: "Monitoramento pós-serviço", text: "Acompanhamento e orientação preventiva após cada atendimento." },
];

export const segments: { title: string; text: string; icon: string }[] = [
  { icon: "🏠", title: "Residencial", text: "Proteção completa para casas e apartamentos, com segurança para toda a família." },
  { icon: "🏢", title: "Condomínios", text: "Planos de controle contínuo para áreas comuns e coletivas." },
  { icon: "🏫", title: "Escolas", text: "Ambientes seguros e higienizados para alunos e colaboradores." },
  { icon: "🏥", title: "Hospitais e clínicas", text: "Padrões rigorosos de sanitização para áreas de saúde." },
  { icon: "🏬", title: "Empresas e comércios", text: "Conformidade sanitária e prevenção para o seu negócio." },
];
