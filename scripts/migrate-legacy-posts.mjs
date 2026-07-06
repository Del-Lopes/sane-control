/**
 * Migra os 3 posts legados (antes hardcoded em src/lib/posts.ts) para a tabela `posts`
 * como status='published', autorados pelo profile do bot (AI_BOT_PROFILE_ID).
 *
 * Pré-requisitos (Fase 4 — STOP HUMANO): profile do bot criado e AI_BOT_PROFILE_ID no .env.local.
 * Uso: node scripts/migrate-legacy-posts.mjs   (a partir da raiz do projeto)
 * Idempotente: pula posts cujo slug já existe.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const env = Object.fromEntries(
  readFileSync(resolve(process.cwd(), '.env.local'), 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY
const botId = env.AI_BOT_PROFILE_ID
if (!url || !key) throw new Error('Faltam NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
if (!botId) throw new Error('AI_BOT_PROFILE_ID não definido no .env.local (crie o bot profile na Fase 4).')

const H = { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' }
const p = (para) => `<p>${para}</p>`

// Conteúdo original dos 3 posts (categoria de destino por slug de categoria).
const LEGACY = [
  {
    slug: 'como-evitar-baratas-em-casa',
    title: 'Como evitar baratas em casa: 5 hábitos que fazem a diferença',
    excerpt:
      'Pequenas mudanças na rotina reduzem drasticamente o risco de infestação. Veja o que fazer no dia a dia.',
    categorySlug: 'prevencao',
    publishedAt: '2026-06-10',
    body: [
      'As baratas estão entre as pragas urbanas mais comuns e também entre as que mais transmitem doenças. A boa notícia é que a prevenção começa com hábitos simples dentro de casa.',
      '1. Mantenha a cozinha limpa e seca, sem restos de alimentos expostos e sem acúmulo de louça durante a noite.',
      '2. Vede frestas e ralos, pontos de entrada preferidos por insetos rasteiros. Ralos com fechamento (abre-fecha) ajudam muito.',
      '3. Descarte o lixo diariamente e mantenha as lixeiras sempre fechadas.',
      '4. Evite acúmulo de papelão e materiais de reciclagem, que servem de abrigo.',
      '5. Ao primeiro sinal de infestação, procure um controle profissional. Quanto antes, mais fácil e barato é resolver.',
    ],
  },
  {
    slug: 'importancia-limpeza-caixa-dagua',
    title: "A importância da limpeza da caixa d'água",
    excerpt:
      'A recomendação é higienizar o reservatório a cada seis meses. Entenda por que isso protege a sua saúde.',
    categorySlug: 'saude-e-saneamento',
    publishedAt: '2026-05-22',
    body: [
      "A caixa d'água armazena toda a água que você consome. Com o tempo, sedimentos, sujeira e microrganismos se acumulam nas paredes e no fundo do reservatório.",
      'A recomendação sanitária é realizar a higienização a cada seis meses, com escovação das paredes e desinfecção adequada.',
      'Na Sane Control, fazemos a limpeza sem desperdício de água e emitimos o registro do serviço, importante para vistorias e para o controle sanitário de empresas.',
    ],
  },
  {
    slug: 'cupins-como-identificar',
    title: 'Cupins: como identificar antes que seja tarde',
    excerpt:
      'Ruídos na madeira, pó fino e asas soltas podem indicar uma infestação. Saiba reconhecer os sinais.',
    categorySlug: 'pragas-urbanas',
    publishedAt: '2026-04-30',
    body: [
      'Os cupins agem silenciosamente e podem causar sérios danos a móveis e estruturas antes de serem percebidos.',
      'Fique atento a alguns sinais: pó fino (parecido com serragem) próximo a móveis e batentes, pequenos furos na madeira, ruídos internos e o surgimento de asas soltas após revoadas.',
      'Existem diferentes tipos de cupim — de madeira seca, subterrâneos e arborícolas — e cada um exige uma abordagem específica. Por isso, o diagnóstico profissional é essencial.',
    ],
  },
]

async function catIdBySlug(slug) {
  const r = await fetch(url + '/rest/v1/categories?select=id&slug=eq.' + slug, { headers: H })
  const j = await r.json()
  return j[0]?.id ?? null
}
async function slugExists(slug) {
  const r = await fetch(url + '/rest/v1/posts?select=slug&slug=eq.' + slug, { headers: H })
  return (await r.json()).length > 0
}

for (const post of LEGACY) {
  if (await slugExists(post.slug)) {
    console.log('• pulado (já existe):', post.slug)
    continue
  }
  const categoryId = await catIdBySlug(post.categorySlug)
  if (!categoryId) {
    console.log('❌ categoria não encontrada:', post.categorySlug, '— pulando', post.slug)
    continue
  }
  const row = {
    title: post.title,
    slug: post.slug,
    content: post.body.map(p).join('\n'),
    excerpt: post.excerpt,
    author_id: botId,
    category_id: categoryId,
    status: 'published',
    published_at: new Date(post.publishedAt + 'T12:00:00-03:00').toISOString(),
  }
  const res = await fetch(url + '/rest/v1/posts', { method: 'POST', headers: H, body: JSON.stringify(row) })
  console.log(res.ok ? '✅ inserido: ' + post.slug : '❌ erro ' + res.status + ' em ' + post.slug + ': ' + (await res.text()).slice(0, 120))
}
console.log('Migração concluída.')
