import { gemini, gemma } from '@/lib/ai/google-ai-client'

const BASE_URL = 'https://www.sanecontrol.com.br'

// Categorias = famílias de serviço da Sane Control (linkam para /servicos/[slug] reais).
type CategoryKey =
  | 'controle-de-pragas'
  | 'desratizacao'
  | 'descupinizacao'
  | 'higienizacao-caixa-dagua'
  | 'sanitizacao'
  | 'desentupimento'

const CATEGORY_URLS: Record<CategoryKey, string> = {
  'controle-de-pragas': `${BASE_URL}/servicos/controle-de-pragas/`,
  desratizacao: `${BASE_URL}/servicos/desratizacao/`,
  descupinizacao: `${BASE_URL}/servicos/descupinizacao/`,
  'higienizacao-caixa-dagua': `${BASE_URL}/servicos/higienizacao-caixa-dagua/`,
  sanitizacao: `${BASE_URL}/servicos/sanitizacao/`,
  desentupimento: `${BASE_URL}/servicos/desentupimento/`,
}
const CATEGORY_LABELS: Record<CategoryKey, string> = {
  'controle-de-pragas': 'Controle de Pragas',
  desratizacao: 'Desratização',
  descupinizacao: 'Descupinização',
  'higienizacao-caixa-dagua': "Higienização de Caixas d'Água",
  sanitizacao: 'Sanitização',
  desentupimento: 'Desentupimento',
}

// Ordem importa — primeira correspondência vence.
const DETECTION_RULES: Array<{ category: CategoryKey; keywords: string[] }> = [
  { category: 'desratizacao', keywords: ['rato', 'ratos', 'roedor', 'roedores', 'camundongo'] },
  { category: 'descupinizacao', keywords: ['cupim', 'cupins', 'termite', 'madeira'] },
  {
    category: 'higienizacao-caixa-dagua',
    keywords: ['caixa d\'agua', 'caixa dagua', 'reservatorio', 'agua potavel', 'agua'],
  },
  {
    category: 'sanitizacao',
    keywords: ['sanitizacao', 'desinfeccao', 'virus', 'bacteria', 'fungo', 'higienizacao de ambiente'],
  },
  { category: 'desentupimento', keywords: ['entupimento', 'tubulacao', 'esgoto', 'caixa de gordura', 'desentupir'] },
  {
    category: 'controle-de-pragas',
    keywords: ['praga', 'pragas', 'barata', 'baratas', 'inseto', 'mosquito', 'dengue', 'aedes', 'formiga', 'escorpiao', 'dedetizacao'],
  },
]

const FALLBACKS: Record<CategoryKey, (url: string) => string> = {
  'controle-de-pragas': (url) =>
    `A Sane Control atua desde 2006 com controle de pragas em São Paulo e região, usando produtos de baixo impacto e equipe própria. Conheça o nosso <a href="${url}">serviço de controle de pragas</a>.`,
  desratizacao: (url) =>
    `Para o controle seguro de roedores, a Sane Control instala estações porta-iscas monitoradas. Saiba mais sobre a <a href="${url}">desratização profissional</a>.`,
  descupinizacao: (url) =>
    `Cupins exigem diagnóstico especializado. A Sane Control combate cupins de madeira seca, subterrâneos e arborícolas — veja a <a href="${url}">descupinização</a>.`,
  'higienizacao-caixa-dagua': (url) =>
    `A Sane Control higieniza reservatórios sem desperdício de água e emite o registro do serviço. Conheça a <a href="${url}">higienização de caixas d'água</a>.`,
  sanitizacao: (url) =>
    `Para desinfecção de ambientes contra vírus, bactérias e fungos, conte com a <a href="${url}">sanitização da Sane Control</a>.`,
  desentupimento: (url) =>
    `Entupimentos resolvidos com agilidade: conheça o serviço de <a href="${url}">desentupimento da Sane Control</a>.`,
}

const normalize = (t: string): string =>
  t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const detectCategory = (text: string): CategoryKey => {
  const n = normalize(text)
  for (const rule of DETECTION_RULES)
    if (rule.keywords.some((kw) => n.includes(normalize(kw)))) return rule.category
  return 'controle-de-pragas'
}
const enforceUrl = (html: string, correctUrl: string): string => {
  if (html.includes(correctUrl)) return html
  const fixed = html.replace(/href="[^"]*"/g, `href="${correctUrl}"`)
  if (fixed !== html) return fixed
  return html.replace(/<\/p>$/, ` Conheça <a href="${correctUrl}">nossos serviços</a>.</p>`)
}
const buildPrompt = (title: string, excerpt: string, label: string, url: string): string =>
  `Você é um redator SEO da Sane Control (controle de pragas, São Paulo e região, desde 2006).
Escreva um parágrafo de fechamento conectando o tema do artigo com a empresa.
ARTIGO — Título: ${title} | Resumo: ${excerpt}
DADOS (use apenas estes): serviço relevante: ${label}; URL (use exatamente esta): ${url}
REGRAS: conecte ao tema real; apresente a Sane Control de forma natural; insira exatamente 1 link href="${url}" com âncora descritiva; nunca "clique aqui"; máx 120 palavras; máx 2 menções ao nome; sem superlativos; não invente dados nem certificações; retorne APENAS o parágrafo em HTML.`.trim()

const tryModel = async (
  model: typeof gemini,
  prompt: string,
  url: string,
  timeoutMs = 8000
): Promise<string> => {
  const result = await Promise.race([
    model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('closing timeout')), timeoutMs)),
  ])
  const cleaned = result.response
    .text()
    .trim()
    .replace(/^```(?:html)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  const wrapped = cleaned.startsWith('<p') ? cleaned : `<p class="post-closing">${cleaned}</p>`
  return enforceUrl(wrapped, url)
}

export const generateSaneClosing = async (
  title: string,
  excerpt: string,
  sourceDescription: string
): Promise<string> => {
  const category = detectCategory(`${title} ${excerpt} ${sourceDescription}`)
  const url = CATEGORY_URLS[category],
    label = CATEGORY_LABELS[category]
  const prompt = buildPrompt(title, `${excerpt} ${sourceDescription}`.slice(0, 500), label, url)
  try {
    return await tryModel(gemini, prompt, url)
  } catch {}
  try {
    return await tryModel(gemma, prompt, url)
  } catch {}
  return `<p class="post-closing">${FALLBACKS[category](url)}</p>`
}
