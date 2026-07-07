import { fetchMultipleFeeds } from './rss-fetcher'

export type NewsArticle = {
  title: string
  url: string
  description: string
  source: string
  publishedAt: string
  density?: 'dense' | 'general' // undefined = 'general'
}

// Categorias do setor de controle de pragas / saúde pública / saneamento.
type Category = 'pragas' | 'saude' | 'dengue' | 'saneamento'

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  pragas: [
    'praga', 'pragas', 'barata', 'baratas', 'rato', 'ratos', 'roedor', 'cupim', 'cupins',
    'inseto', 'insetos', 'escorpiao', 'escorpioes', 'formiga', 'mosca', 'pulga', 'carrapato',
    'dedetizacao', 'dedetizar', 'infestacao', 'pest', 'pest control', 'cockroach', 'rodent', 'termite',
  ],
  saude: [
    'saude', 'doenca', 'doencas', 'vigilancia sanitaria', 'anvisa', 'contaminacao', 'higiene',
    'zoonose', 'zoonoses', 'surto', 'epidemia', 'health', 'sanitary', 'disease',
  ],
  dengue: [
    'dengue', 'aedes', 'aedes aegypti', 'zika', 'chikungunya', 'arbovirose', 'arboviroses',
    'mosquito', 'febre amarela', 'malaria', 'foco', 'focos', 'larva', 'larvas',
  ],
  saneamento: [
    'saneamento', 'agua', 'caixa d\'agua', 'reservatorio', 'esgoto', 'potavel', 'agua potavel',
    'tratamento de agua', 'sanitizacao', 'desinfeccao', 'water', 'sanitation', 'sewage',
  ],
}

function detectCategory(topic: string): Category {
  const t = topic.toLowerCase()
  if (CATEGORY_KEYWORDS.dengue.some((kw) => t.includes(kw))) return 'dengue'
  if (CATEGORY_KEYWORDS.pragas.some((kw) => t.includes(kw))) return 'pragas'
  if (CATEGORY_KEYWORDS.saneamento.some((kw) => t.includes(kw))) return 'saneamento'
  if (CATEGORY_KEYWORDS.saude.some((kw) => t.includes(kw))) return 'saude'
  return 'saude'
}

// Query em pt-BR focada no nicho, por tópico. Para NewsAPI com language=pt.
const TOPIC_QUERY: Array<[RegExp, string]> = [
  [/dengue|aedes/i, '(dengue OR "Aedes aegypti" OR arbovirose OR chikungunya OR zika OR "foco do mosquito")'],
  [/praga/i, '("controle de pragas" OR dedetização OR desratização OR descupinização OR barata OR roedor OR cupim OR escorpião OR infestação)'],
  [/saneamento|agua|saúde/i, '(saneamento OR "vigilância sanitária" OR "caixa d\'água" OR "água potável" OR zoonose OR "doenças transmitidas")'],
]
function expandQueryBilingual(topic: string): string {
  for (const [pattern, query] of TOPIC_QUERY) if (pattern.test(topic)) return query
  // fallback: usa o tópico + termos gerais de nicho
  return `${topic} OR "controle de pragas" OR dengue`
}

// ⚠️ Feeds RSS reais do setor — VALIDAR AO VIVO (Risco #5). Fontes brasileiras de saúde
// pública / saneamento (Agência Brasil, Fiocruz) cobrem pragas/dengue/vigilância sanitária.
const RSS_BY_CATEGORY: Record<Category, string[]> = {
  pragas: [
    'https://agenciabrasil.ebc.com.br/rss/saude/feed.xml',
    'https://www.bio.fiocruz.br/index.php/br/?format=feed&type=rss',
  ],
  saude: [
    'https://agenciabrasil.ebc.com.br/rss/saude/feed.xml',
    'https://www.paho.org/pt/rss.xml',
  ],
  dengue: [
    'https://agenciabrasil.ebc.com.br/rss/saude/feed.xml',
    'https://www.paho.org/pt/rss.xml',
  ],
  saneamento: [
    'https://agenciabrasil.ebc.com.br/rss/geral/feed.xml',
    'https://agenciabrasil.ebc.com.br/rss/saude/feed.xml',
  ],
}
// null = busca em toda a imprensa pt (language=pt), filtrada pela query de nicho.
// Assim a NewsAPI encontra notícias específicas de pragas/dengue em qualquer veículo,
// não só nos 2 domínios antes fixados.
const NEWSAPI_DOMAINS: Record<Category, string | null> = {
  pragas: null,
  saude: null,
  dengue: null,
  saneamento: null,
}

const TIER1_NAMES = new Set(['agencia brasil', 'agenciabrasil', 'fiocruz', 'paho', 'opas'])
const TIER2_NAMES = new Set(['g1', 'globo', 'uol'])
function sourceTier(sourceName: string): 0 | 1 | 2 {
  const s = sourceName.toLowerCase()
  if ([...TIER1_NAMES].some((n) => s.includes(n))) return 1
  if ([...TIER2_NAMES].some((n) => s.includes(n))) return 2
  return 0
}

const POSITIVE_KEYWORDS = [
  'praga', 'dengue', 'aedes', 'saude', 'vigilancia sanitaria', 'saneamento', 'agua', 'higiene', 'zoonose',
]
const NEGATIVE_KEYWORDS = ['celebridade', 'politica', 'crime', 'cripto', 'futebol', 'receita', 'novela', 'bbb']

// Termos que marcam relevância REAL para o nicho da Sane Control. Uma notícia
// PRECISA bater em pelo menos um destes para ser considerada — assim uma notícia
// de saúde geral (ex.: vacina VSR) de fonte confiável não passa só por ser tier-1.
const NICHE_TERMS = [
  'praga', 'pragas', 'barata', 'baratas', 'rato', 'ratos', 'roedor', 'cupim', 'cupins',
  'inseto', 'insetos', 'escorpiao', 'escorpioes', 'formiga', 'mosquito', 'mosquitos',
  'pulga', 'carrapato', 'dengue', 'aedes', 'zika', 'chikungunya', 'arbovirose',
  'dedetizacao', 'dedetizar', 'desinsetizacao', 'desratizacao', 'descupinizacao',
  'infestacao', 'vetor', 'zoonose', 'zoonoses', 'sanitizacao', 'saneamento',
  'caixa d', 'reservatorio', 'agua potavel', 'vigilancia sanitaria', 'foco do mosquito',
  'pest control', 'rodent', 'termite',
]
function hasNicheRelevance(text: string): boolean {
  return NICHE_TERMS.some((kw) => text.includes(kw))
}

function scoreArticle(article: NewsArticle, topic: string, category: Category): number {
  const text = `${article.title} ${article.description}`.toLowerCase()
  let score = 0
  // Bônus de nicho: o que importa é ser do nicho, não a fonte. Garante que qualquer
  // notícia relevante (mesmo de portal regional) fique acima do threshold.
  if (hasNicheRelevance(text)) score += 3
  const tier = sourceTier(article.source)
  if (tier === 1) score += 3
  else if (tier === 2) score += 2
  if (CATEGORY_KEYWORDS[category].some((kw) => text.includes(kw))) score += 2
  const topicWords = topic.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
  for (const word of topicWords) if (text.includes(word)) score += 3
  for (const kw of POSITIVE_KEYWORDS) if (text.includes(kw)) score += 2
  for (const kw of NEGATIVE_KEYWORDS) if (text.includes(kw)) score -= 5
  return score
}
// O "portão duro" de relevância é o hasNicheRelevance() no loop principal — ele
// já garante que a notícia trata do nicho. O SCORE serve para ORDENAR/priorizar,
// não para barrar: por isso o threshold é baixo (notícias relevantes aparecem em
// veículos regionais tier-0/2 que pontuam pouco). Threshold alto (ex.: 5) barrava
// notícias boas de escorpião/dengue de portais menores.
const SCORE_THRESHOLD = 1

function isJunk(a: NewsArticle): boolean {
  return !a.title || a.title.length < 20 || !a.url
}
function normaliseTitle(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
}
function parseDate(d: string): number {
  if (!d) return 0
  try {
    return new Date(d).getTime()
  } catch {
    return 0
  }
}

function applyDiversityFilter(
  rawScored: Array<{ article: NewsArticle; score: number }>,
  maxPerSource = 3,
  targetCount = 10
): NewsArticle[] {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
  const sorted = [...rawScored].sort((a, b) => {
    const da = parseDate(a.article.publishedAt),
      db = parseDate(b.article.publishedAt)
    if (Math.abs(db - da) > ONE_WEEK_MS) return db - da
    return b.score - a.score
  })
  const sourceCount = new Map<string, number>()
  const selected: Array<{ article: NewsArticle; score: number }> = []
  const overflow: Array<{ article: NewsArticle; score: number }> = []
  for (const item of sorted) {
    const key = item.article.source.toLowerCase()
    const count = sourceCount.get(key) ?? 0
    if (count < maxPerSource) {
      selected.push(item)
      sourceCount.set(key, count + 1)
    } else overflow.push(item)
    if (selected.length >= targetCount) break
  }
  if (selected.length < targetCount) {
    overflow.sort((a, b) => b.score - a.score)
    for (const item of overflow) {
      selected.push(item)
      if (selected.length >= targetCount) break
    }
  }
  return selected.map(({ article }) => article)
}

type RawApiArticle = {
  title?: string
  url?: string
  description?: string
  content?: string
  source?: { name?: string }
  publishedAt?: string
}
async function fetchFromNewsAPI(apiKey: string, topic: string, domains: string): Promise<NewsArticle[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const url = new URL('https://newsapi.org/v2/everything')
    // Query focada no nicho, em pt-BR. `domains` fica como parâmetro opcional
    // (passar string vazia = busca em toda a imprensa pt, filtrada pela query).
    url.searchParams.set('q', expandQueryBilingual(topic))
    url.searchParams.set('language', 'pt')
    if (domains) url.searchParams.set('domains', domains)
    url.searchParams.set('sortBy', 'publishedAt')
    url.searchParams.set('pageSize', '20')
    url.searchParams.set('apiKey', apiKey)
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: 300 },
    } as RequestInit)
    if (!res.ok) {
      console.warn(`[news-curation] NewsAPI ${res.status}`)
      return []
    }
    const data = await res.json()
    return ((data.articles ?? []) as RawApiArticle[]).flatMap((a) => {
      const title = a.title?.trim() ?? '',
        articleUrl = a.url?.trim() ?? ''
      if (!title || !articleUrl) return []
      return [
        {
          title,
          url: articleUrl,
          description: a.description?.trim() ?? a.content?.trim() ?? '',
          source: a.source?.name ?? '',
          publishedAt: a.publishedAt ?? '',
        },
      ]
    })
  } catch (err) {
    console.warn('[news-curation] NewsAPI fetch failed:', err)
    return []
  } finally {
    clearTimeout(timer)
  }
}

export const fetchNewsByTopic = async (topic: string): Promise<NewsArticle[]> => {
  const category = detectCategory(topic)
  const apiKey = process.env.NEWS_API_KEY
  const [rssArticles, newsapiArticles] = await Promise.all([
    fetchMultipleFeeds(RSS_BY_CATEGORY[category]),
    apiKey && NEWSAPI_DOMAINS[category]
      ? fetchFromNewsAPI(apiKey, topic, NEWSAPI_DOMAINS[category]!)
      : Promise.resolve([] as NewsArticle[]),
  ])
  const seenTitles = new Set<string>()
  const rawScored: Array<{ article: NewsArticle; score: number }> = []
  for (const article of [...rssArticles, ...newsapiArticles]) {
    if (isJunk(article)) continue
    const norm = normaliseTitle(article.title)
    if (seenTitles.has(norm)) continue
    seenTitles.add(norm)
    // Requisito duro: precisa ter relevância REAL de nicho (não basta ser fonte boa).
    const text = `${article.title} ${article.description}`.toLowerCase()
    if (!hasNicheRelevance(text)) continue
    const score = scoreArticle(article, topic, category)
    if (score < SCORE_THRESHOLD) continue
    rawScored.push({ article, score })
  }
  return applyDiversityFilter(rawScored, 3, 10)
}
