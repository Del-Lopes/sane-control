/**
 * Camada de dados do blog — agora lê do Supabase (Fase 3 do ROADMAP_AUTO_BLOG).
 * Usa o client SSR (anon), que respeita RLS: público só enxerga status='published'.
 * A categoria oculta de vendas (slug em HIDDEN_SLUGS) é excluída da listagem,
 * mas continua acessível por URL direta (SEO local indexável).
 */
import { createSupabaseServerClient } from '@/lib/db/supabase-server'

// Categorias que não aparecem na listagem do blog (mas são indexáveis por URL).
export const HIDDEN_SLUGS = ['google'] as const

/** Post no formato consumido pelas páginas do blog (view model). */
export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string // HTML
  coverImage: string | null
  date: string // ISO (published_at || created_at)
  readingTime: string
  category: string
  categorySlug: string
  sourceUrl: string | null
  seoTitle: string | null
  seoDescription: string | null
  isAiCover: boolean
}

type PostRow = {
  slug: string
  title: string
  excerpt: string | null
  content: string
  cover_image: string | null
  image_prompt: string | null
  source_url: string | null
  seo_title: string | null
  seo_description: string | null
  published_at: string | null
  created_at: string
  categories: { name: string; slug: string } | { name: string; slug: string }[] | null
}

const POST_SELECT =
  'slug,title,excerpt,content,cover_image,image_prompt,source_url,seo_title,seo_description,published_at,created_at,categories(name,slug)'

/** Estima tempo de leitura a partir do HTML (~200 palavras/min). */
function estimateReadingTime(html: string): string {
  const words = html.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min`
}

function mapRow(row: PostRow): BlogPost {
  const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? '',
    content: row.content,
    coverImage: row.cover_image,
    date: row.published_at ?? row.created_at,
    readingTime: estimateReadingTime(row.content),
    category: cat?.name ?? '',
    categorySlug: cat?.slug ?? '',
    sourceUrl: row.source_url,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    // Capa gerada por IA quando há prompt de imagem (legenda "imagem conceitual").
    isAiCover: Boolean(row.image_prompt) && Boolean(row.cover_image),
  }
}

/** Lista de posts publicados (exclui a categoria oculta), paginada. */
export async function getPublishedPosts({
  page = 1,
  pageSize = 24,
}: { page?: number; pageSize?: number } = {}): Promise<BlogPost[]> {
  const supabase = await createSupabaseServerClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (error || !data) return []
  return (data as unknown as PostRow[])
    .map(mapRow)
    .filter((p) => !HIDDEN_SLUGS.includes(p.categorySlug as (typeof HIDDEN_SLUGS)[number]))
}

/** Um post publicado por slug (inclui categoria oculta — acessível por URL direta). */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle()

  if (error || !data) return null
  return mapRow(data as unknown as PostRow)
}

/** Posts relacionados (mesma categoria de preferência), excluindo o atual e os ocultos. */
export async function getRelatedPosts(post: BlogPost, limit = 2): Promise<BlogPost[]> {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('posts')
    .select(POST_SELECT)
    .eq('status', 'published')
    .neq('slug', post.slug)
    .order('published_at', { ascending: false })
    .limit(12)

  if (error || !data) return []
  const all = (data as unknown as PostRow[])
    .map(mapRow)
    .filter((p) => !HIDDEN_SLUGS.includes(p.categorySlug as (typeof HIDDEN_SLUGS)[number]))

  const sameCat = all.filter((p) => p.categorySlug === post.categorySlug)
  const others = all.filter((p) => p.categorySlug !== post.categorySlug)
  return [...sameCat, ...others].slice(0, limit)
}

/** Slugs publicados (para generateStaticParams / sitemaps, se necessário). */
export async function getPublishedSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts({ pageSize: 100 })
  return posts.map((p) => p.slug)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
