/**
 * Configuração das landing pages de higienização de estofados por região.
 *
 * Existe uma landing geral e duas geolocalizadas. Elas compartilham o mesmo
 * corpo (EstofadosLanding), mas cada região traz H1, hero, cobertura, ângulo
 * local e FAQs próprios — conteúdo genuinamente diferente, e não a mesma página
 * com o nome da cidade trocado (o Google trata isso como doorway page).
 *
 * O raio de 10 km definido pelo tráfego pago não aparece no texto: ele entra
 * apenas no GeoCircle do JSON-LD, que é o campo do schema.org feito para isso.
 *
 * COMPLIANCE (RDC 622/2022 da ANVISA — ver src/lib/services.ts):
 *  - Proibido: "seguro", "atóxico", "inócuo", "produto natural", "sem riscos".
 *  - Obrigatório: "baixa toxicidade", "segurança operacional", "saneantes".
 */

import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Wind,
  Sparkles,
  CalendarCheck,
  Trees,
  PawPrint,
  Flame,
  MapPin,
} from "lucide-react";

export type EstofadosRegiao = {
  key: string;
  path: string;
  /** Rótulo curto usado nos links entre as landings. */
  navLabel: string;
  meta: {
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
  };
  hero: {
    eyebrow: string;
    h1: string;
    lead: string;
  };
  /** Rótulo da área de atendimento na barra de confiança e no bloco final. */
  areaLabel: string;
  /** Mensagem pré-preenchida do WhatsApp — identifica de qual landing veio o lead. */
  whatsappMsg: string;
  /** Bloco "onde atendemos" — ausente na landing geral. */
  cobertura: {
    eyebrow: string;
    title: string;
    subtitle: string;
    areas: string[];
    note: string;
  } | null;
  /** Ângulo local: por que o estofado sofre desse jeito nessa região. */
  anguloLocal: {
    eyebrow: string;
    title: string;
    subtitle: string;
    pontos: { icon: LucideIcon; title: string; text: string }[];
  } | null;
  /** FAQs específicas da região, exibidas antes das perguntas gerais. */
  faqsLocais: { q: string; a: string }[];
  /** areaServed do JSON-LD. O GeoCircle carrega o raio de captação. */
  geo: {
    lat: number;
    lng: number;
    /** Metros. */
    raio: number;
    lugares: string[];
  } | null;
};

export const regiaoGeral: EstofadosRegiao = {
  key: "geral",
  path: "/limpeza-de-estofados",
  navLabel: "São Paulo e Região Metropolitana",
  meta: {
    title: "Higienização de Estofados em São Paulo e Região",
    description:
      "Higienização e impermeabilização de sofás, colchões, poltronas e bancos automotivos com extração por sucção e saneantes de baixa toxicidade. Orçamento sem compromisso pelo WhatsApp.",
    keywords: [
      "higienização de estofados",
      "limpeza de sofá",
      "higienização de colchão",
      "impermeabilização de estofados",
      "São Paulo e Região Metropolitana",
    ],
    ogTitle: "Higienização de Estofados | Sane Control",
  },
  hero: {
    eyebrow: "Higienização de estofados",
    h1: "Seu sofá parece limpo. Por dentro, ele guarda outra história.",
    lead: "Higienização e impermeabilização de sofás, colchões, poltronas e bancos automotivos com extração por sucção e saneantes de baixa toxicidade. Feito no seu endereço, em São Paulo e Região Metropolitana.",
  },
  areaLabel: "São Paulo e Região Metropolitana",
  whatsappMsg:
    "Olá! Vim pelo site e gostaria de um orçamento para higienização de estofados.",
  cobertura: null,
  anguloLocal: null,
  faqsLocais: [],
  geo: null,
};

export const regiaoSaoPaulo: EstofadosRegiao = {
  key: "sao-paulo",
  path: "/limpeza-de-estofados-sao-paulo",
  navLabel: "São Paulo — Moema e Zona Sul",
  meta: {
    title: "Higienização de Estofados em São Paulo — Moema e Zona Sul",
    description:
      "Higienização e impermeabilização de sofás, colchões e poltronas em Moema, Vila Nova Conceição, Campo Belo, Itaim Bibi, Vila Mariana e Brooklin. Atendimento em apartamento, no seu endereço.",
    keywords: [
      "higienização de estofados São Paulo",
      "limpeza de sofá Moema",
      "higienização de sofá zona sul São Paulo",
      "limpeza de estofados Vila Nova Conceição",
      "higienização de colchão São Paulo",
      "impermeabilização de sofá São Paulo",
    ],
    ogTitle: "Higienização de Estofados em Moema e Zona Sul | Sane Control",
  },
  hero: {
    eyebrow: "Moema, Zona Sul e bairros vizinhos",
    h1: "Higienização de estofados em São Paulo, sem tirar o sofá do lugar",
    lead: "Atendemos apartamentos e condomínios de Moema e da Zona Sul com extração por sucção, ação sanitizante e impermeabilização. A equipe vai até você, executa no local e devolve a peça ao uso no mesmo dia.",
  },
  areaLabel: "Moema, Zona Sul e bairros vizinhos",
  whatsappMsg:
    "Olá! Vim pela página de São Paulo e gostaria de um orçamento para higienização de estofados. Meu bairro é:",
  cobertura: {
    eyebrow: "Onde atendemos",
    title: "Moema e os bairros ao redor",
    subtitle:
      "Concentramos a agenda da capital na Zona Sul, o que encurta o deslocamento e abre mais janelas de horário para quem mora na região.",
    areas: [
      "Moema",
      "Vila Nova Conceição",
      "Indianópolis",
      "Planalto Paulista",
      "Campo Belo",
      "Brooklin",
      "Itaim Bibi",
      "Vila Olímpia",
      "Jardim Paulista",
      "Jardins",
      "Paraíso",
      "Vila Mariana",
      "Vila Clementino",
      "Saúde",
      "Chácara Klabin",
      "Aclimação",
      "Ibirapuera",
      "Cidade Monções",
      "Berrini",
      "Santo Amaro",
      "Jabaquara",
      "Morumbi",
      "Pinheiros",
      "Cidade Jardim",
    ],
    note: "Não encontrou o seu bairro? Mande uma mensagem: a agenda da capital cobre bairros vizinhos aos listados acima.",
  },
  anguloLocal: {
    eyebrow: "Morar em apartamento muda o serviço",
    title: "Por que o estofado de apartamento pede outro cuidado",
    subtitle:
      "Um sofá em um apartamento da Zona Sul enfrenta condições que uma casa com quintal não impõe. O nosso protocolo leva isso em conta.",
    pontos: [
      {
        icon: Wind,
        title: "Não dá para arejar no quintal",
        text: "Sem sol direto nem ventilação cruzada, a umidade da limpeza caseira demora a sair da espuma e volta como cheiro de guardado. A extração por sucção retira a água junto com a sujeira, e os sopradores completam a secagem antes de irmos embora.",
      },
      {
        icon: Building2,
        title: "A poeira das avenidas assenta no tecido",
        text: "Quem mora perto do Ibirapuera, da Bandeirantes ou da 23 de Maio conhece a película escura no parapeito. Ela também se deposita no sofá todos os dias, e o aspirador doméstico só tira a camada de cima.",
      },
      {
        icon: Sparkles,
        title: "Tecidos claros e nobres pedem técnica",
        text: "Veludo, linho, suede e couro são comuns nos apartamentos da região e reagem de formas diferentes ao mesmo produto. Avaliamos a peça e definimos o saneante antes de encostar o equipamento nela.",
      },
      {
        icon: CalendarCheck,
        title: "A rotina do condomínio é respeitada",
        text: "Agendamos dentro do horário permitido pelo regimento interno, usamos o elevador de serviço quando exigido e a equipe chega uniformizada e identificada para a portaria liberar sem atrito.",
      },
    ],
  },
  faqsLocais: [
    {
      q: "Vocês atendem apartamento em condomínio com regras de horário?",
      a: "Sim, e é a maior parte do que fazemos na capital. Agendamos dentro da janela permitida pelo regimento interno, usamos o elevador de serviço quando o condomínio exige e a equipe vai uniformizada e identificada, o que facilita a liberação na portaria. Se o prédio pedir aviso prévio ou alguma autorização, é só nos informar no agendamento.",
    },
    {
      q: "Meu sofá é grande e não passa pelo elevador. Isso é um problema?",
      a: "Não. Todo o serviço é executado dentro do seu apartamento, com equipamento próprio. Nada precisa ser desmontado, retirado do lugar ou levado para fora — inclusive sofás de canto e conjuntos com chaise.",
    },
    {
      q: "Quanto tempo a equipe fica no apartamento?",
      a: "Depende das peças. Um sofá de três lugares costuma levar cerca de uma hora; um conjunto com sofá, poltronas e colchões pode chegar a três horas. Informamos a previsão junto com o orçamento, para você organizar o dia.",
    },
  ],
  geo: {
    // Centro aproximado de Moema — define o raio de captação da campanha.
    lat: -23.6009,
    lng: -46.6653,
    raio: 10000,
    lugares: [
      "Moema",
      "Vila Nova Conceição",
      "Campo Belo",
      "Brooklin",
      "Itaim Bibi",
      "Vila Olímpia",
      "Jardim Paulista",
      "Vila Mariana",
      "Saúde",
      "Santo Amaro",
      "Jabaquara",
      "Pinheiros",
      "São Paulo",
    ],
  },
};

export const regiaoCaieiras: EstofadosRegiao = {
  key: "caieiras",
  path: "/limpeza-de-estofados-caieiras",
  navLabel: "Caieiras e região",
  meta: {
    title: "Higienização de Estofados em Caieiras e Região",
    description:
      "Higienização e impermeabilização de sofás, colchões e poltronas em Caieiras, Franco da Rocha, Francisco Morato, Cajamar e Perus. Empresa com base em Caieiras desde 2009.",
    keywords: [
      "higienização de estofados Caieiras",
      "limpeza de sofá Caieiras",
      "higienização de estofados Franco da Rocha",
      "limpeza de sofá Francisco Morato",
      "higienização de estofados Cajamar",
      "impermeabilização de sofá Caieiras",
    ],
    ogTitle: "Higienização de Estofados em Caieiras | Sane Control",
  },
  hero: {
    eyebrow: "Caieiras, Franco da Rocha e região",
    h1: "Higienização de estofados em Caieiras, feita por quem é daqui",
    lead: "Nossa base fica na Rua Alcides Banhe, em Caieiras, desde 2009. Higienizamos e impermeabilizamos sofás, colchões e poltronas com extração por sucção e saneantes de baixa toxicidade, no seu endereço.",
  },
  areaLabel: "Caieiras, Franco da Rocha e região",
  whatsappMsg:
    "Olá! Vim pela página de Caieiras e gostaria de um orçamento para higienização de estofados. Meu bairro é:",
  cobertura: {
    eyebrow: "Onde atendemos",
    title: "Caieiras e as cidades vizinhas",
    subtitle:
      "Estar sediada em Caieiras significa deslocamento curto: conseguimos encaixar atendimentos com mais rapidez do que quem vem da capital.",
    areas: [
      "Caieiras — Centro",
      "Serpa",
      "Laranjeiras",
      "Portal das Laranjeiras",
      "Morro Grande",
      "Nova Caieiras",
      "Vila Rosina",
      "Jardim dos Eucaliptos",
      "Calcária",
      "Franco da Rocha",
      "Francisco Morato",
      "Cajamar",
      "Polvilho",
      "Perus",
      "Anhanguera",
    ],
    note: "Também atendemos condomínios fechados, chácaras e sítios da região — é só confirmar o endereço na hora do orçamento.",
  },
  anguloLocal: {
    eyebrow: "Serra, mata e quintal",
    title: "Por que o estofado sofre mais nesta região",
    subtitle:
      "Viver perto da mata tem tudo de bom, menos para o tecido do sofá. As condições daqui exigem uma frequência e um cuidado diferentes dos da capital.",
    pontos: [
      {
        icon: Trees,
        title: "Umidade alta boa parte do ano",
        text: "A proximidade com a serra mantém o ar úmido, e espuma que não seca por completo favorece mofo e aquele cheiro de guardado. Por isso a extração e a secagem acelerada são a parte mais importante do serviço aqui.",
      },
      {
        icon: PawPrint,
        title: "Quintal, pet e terra",
        text: "Em casa com quintal, o pet sobe no sofá trazendo terra, folha e pelo. É uma sujidade diferente da poeira urbana: mais grossa, mais profunda, e ela se acomoda no fundo da espuma.",
      },
      {
        icon: Flame,
        title: "Área gourmet e churrasqueira",
        text: "Fumaça e gordura impregnam os estofados da varanda e da área de lazer, deixando o tecido pegajoso e com odor. Pano úmido não resolve, porque a gordura já passou da superfície.",
      },
      {
        icon: MapPin,
        title: "Somos vizinhos, não visitantes",
        text: "Atendemos Caieiras desde 2009, com equipe própria e licença municipal nº 9081 da Prefeitura. Isso significa agenda mais flexível, retorno rápido e uma empresa que você encontra na cidade se precisar.",
      },
    ],
  },
  faqsLocais: [
    {
      q: "Vocês atendem Franco da Rocha, Francisco Morato e Cajamar?",
      a: "Sim. Além de toda Caieiras, atendemos Franco da Rocha, Francisco Morato, Cajamar, Polvilho, Perus e Anhanguera. Se o seu endereço estiver fora dessa lista, mande uma mensagem: dependendo da agenda, conseguimos encaixar.",
    },
    {
      q: "Atendem condomínio fechado, chácara e sítio?",
      a: "Sim. Levamos equipamento e água quando necessário, então não dependemos da estrutura do local. Para condomínios fechados, basta avisar o nome da equipe na portaria; a Sane Control vai uniformizada e com veículo identificado.",
    },
    {
      q: "Cobram taxa de deslocamento?",
      a: "Nossa base fica em Caieiras, então o deslocamento dentro da cidade e das vizinhas normalmente já está incluído no valor do serviço. Qualquer condição diferente é informada no orçamento, sempre antes do agendamento.",
    },
  ],
  geo: {
    // Centro aproximado de Caieiras — define o raio de captação da campanha.
    lat: -23.3644,
    lng: -46.7406,
    raio: 10000,
    lugares: [
      "Caieiras",
      "Franco da Rocha",
      "Francisco Morato",
      "Cajamar",
      "Polvilho",
      "Perus",
      "Anhanguera",
    ],
  },
};

export const regioesEstofados = [regiaoGeral, regiaoSaoPaulo, regiaoCaieiras];

/** Metadata da landing — cada região é canônica de si mesma. */
export function buildEstofadosMetadata(regiao: EstofadosRegiao): Metadata {
  return {
    title: regiao.meta.title,
    description: regiao.meta.description,
    keywords: regiao.meta.keywords,
    alternates: { canonical: regiao.path },
    openGraph: {
      title: regiao.meta.ogTitle,
      description: regiao.meta.description,
      url: regiao.path,
      type: "website",
      locale: "pt_BR",
      images: ["/images/estofado-depois.jpg"],
    },
  };
}

/** Landings irmãs, para o bloco de links entre regiões. */
export function outrasRegioes(atual: EstofadosRegiao): EstofadosRegiao[] {
  return regioesEstofados.filter((r) => r.key !== atual.key);
}
