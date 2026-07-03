/**
 * Posts do blog. Estrutura inicial com conteúdo próprio sobre o ramo.
 * Pode ser migrado futuramente para um CMS ou arquivos Markdown.
 */

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readingTime: string;
  category: string;
  body: string[]; // parágrafos
};

export const posts: Post[] = [
  {
    slug: "como-evitar-baratas-em-casa",
    title: "Como evitar baratas em casa: 5 hábitos que fazem a diferença",
    excerpt:
      "Pequenas mudanças na rotina reduzem drasticamente o risco de infestação. Veja o que fazer no dia a dia.",
    date: "2026-06-10",
    readingTime: "4 min",
    category: "Prevenção",
    body: [
      "As baratas estão entre as pragas urbanas mais comuns e também entre as que mais transmitem doenças. A boa notícia é que a prevenção começa com hábitos simples dentro de casa.",
      "1. Mantenha a cozinha limpa e seca, sem restos de alimentos expostos e sem acúmulo de louça durante a noite.",
      "2. Vede frestas e ralos, pontos de entrada preferidos por insetos rasteiros. Ralos com fechamento (abre-fecha) ajudam muito.",
      "3. Descarte o lixo diariamente e mantenha as lixeiras sempre fechadas.",
      "4. Evite acúmulo de papelão e materiais de reciclagem, que servem de abrigo.",
      "5. Ao primeiro sinal de infestação, procure um controle profissional. Quanto antes, mais fácil e barato é resolver.",
    ],
  },
  {
    slug: "importancia-limpeza-caixa-dagua",
    title: "A importância da limpeza da caixa d'água",
    excerpt:
      "A recomendação é higienizar o reservatório a cada seis meses. Entenda por que isso protege a sua saúde.",
    date: "2026-05-22",
    readingTime: "3 min",
    category: "Saúde",
    body: [
      "A caixa d'água armazena toda a água que você consome. Com o tempo, sedimentos, sujeira e microrganismos se acumulam nas paredes e no fundo do reservatório.",
      "A recomendação sanitária é realizar a higienização a cada seis meses, com escovação das paredes e desinfecção adequada.",
      "Na Sane Control, fazemos a limpeza sem desperdício de água e emitimos o registro do serviço, importante para vistorias e para o controle sanitário de empresas.",
    ],
  },
  {
    slug: "cupins-como-identificar",
    title: "Cupins: como identificar antes que seja tarde",
    excerpt:
      "Ruídos na madeira, pó fino e asas soltas podem indicar uma infestação. Saiba reconhecer os sinais.",
    date: "2026-04-30",
    readingTime: "5 min",
    category: "Pragas",
    body: [
      "Os cupins agem silenciosamente e podem causar sérios danos a móveis e estruturas antes de serem percebidos.",
      "Fique atento a alguns sinais: pó fino (parecido com serragem) próximo a móveis e batentes, pequenos furos na madeira, ruídos internos e o surgimento de asas soltas após revoadas.",
      "Existem diferentes tipos de cupim — de madeira seca, subterrâneos e arborícolas — e cada um exige uma abordagem específica. Por isso, o diagnóstico profissional é essencial.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}
