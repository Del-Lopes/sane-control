'use server'

import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { requireAdmin } from '@/server/auth.helpers'
import { fetchNewsByTopic } from '@/lib/ai/news-curation'
import { generatePostContent } from '@/lib/ai/content-generator'
import { generateSalesPostContent } from '@/lib/ai/sales-post-generator'
import { generateCoverImage } from '@/lib/utils/hf-image'
import { pickService } from '@/lib/automation/sane-services'
import { revalidatePath } from 'next/cache'

export type AiActionResult = { error: string } | { success: string; slug: string }

// Rate-limit simples por usuário (in-memory) — evita rajadas de geração manual.
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const attempts = new Map<string, { count: number; first: number }>()
function isRateLimited(userId: string): boolean {
  const now = Date.now()
  const e = attempts.get(userId)
  if (!e || now - e.first > RATE_LIMIT_WINDOW_MS) {
    attempts.set(userId, { count: 1, first: now })
    return false
  }
  e.count++
  return e.count > RATE_LIMIT_MAX
}

async function resolveCategoryId(slug: string, name: string): Promise<string | null> {
  const { data } = await supabaseAdmin.from('categories').select('id').eq('slug', slug).maybeSingle()
  if (data) return (data as { id: string }).id
  const { data: created } = await supabaseAdmin
    .from('categories')
    .insert({ name, slug })
    .select('id')
    .single()
  return created ? (created as { id: string }).id : null
}

function uniqueSlug(base: string): string {
  return `${base}-${Math.floor(Math.random() * 9000) + 1000}`
}

/**
 * Gera um post de NOTÍCIA sob demanda e salva como RASCUNHO (review_required)
 * para revisão humana antes de publicar. topic ex.: 'Pragas urbanas'.
 */
export async function generateNewsPostDraft(topic: string): Promise<AiActionResult> {
  const admin = await requireAdmin()
  if (isRateLimited(admin.id)) return { error: 'Muitas gerações seguidas. Aguarde alguns minutos.' }

  const botId = process.env.AI_BOT_PROFILE_ID
  if (!botId) return { error: 'AI_BOT_PROFILE_ID não configurado.' }

  try {
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('source_url')
      .not('source_url', 'is', null)
    const known = new Set<string>(
      (existing ?? []).map((r) => (r as { source_url: string }).source_url).filter(Boolean)
    )
    const articles = (await fetchNewsByTopic(topic)).filter((a) => a.url && !known.has(a.url))
    if (articles.length === 0) return { error: 'Nenhuma notícia nova encontrada para este tema.' }
    const article = articles[0]

    const generated = await generatePostContent({
      title: article.title,
      url: article.url,
      description: article.description,
    })
    const { url: imgUrl, origin } = await generateCoverImage(generated.image_prompt)
    const categoryId = await resolveCategoryId('pragas-urbanas', 'Pragas Urbanas')
    if (!categoryId) return { error: 'Categoria não encontrada.' }

    const slug = uniqueSlug(generated.slug)
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title: generated.title,
        slug,
        content: generated.content,
        excerpt: generated.excerpt,
        status: 'review_required',
        author_id: botId,
        category_id: categoryId,
        source_url: article.url,
        image_prompt: generated.image_prompt,
        cover_image: imgUrl,
        seo_title: generated.seo_title,
        seo_description: generated.seo_description,
        seo_keywords: generated.seo_keywords,
      })
      .select('id')
      .single()
    if (error || !post) return { error: error?.message ?? 'Falha ao salvar.' }

    await supabaseAdmin.from('ai_automation_logs').insert({
      post_id: (post as { id: string }).id,
      prompt_used: article.url,
      model_version: generated.model_used,
      raw_response: { type: 'manual_news', topic, imageOrigin: origin } as Record<string, unknown>,
    })
    revalidatePath('/admin/posts')
    return { success: 'Rascunho de notícia gerado para revisão.', slug }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro inesperado na geração.' }
  }
}

/**
 * Gera um post de VENDAS (serviço × cidade) sob demanda como RASCUNHO.
 */
export async function generateSalesPostDraft(
  service: string,
  city: string
): Promise<AiActionResult> {
  const admin = await requireAdmin()
  if (isRateLimited(admin.id)) return { error: 'Muitas gerações seguidas. Aguarde alguns minutos.' }

  const botId = process.env.AI_BOT_PROFILE_ID
  if (!botId) return { error: 'AI_BOT_PROFILE_ID não configurado.' }

  try {
    const chosenService = service || pickService(new Date().toISOString().slice(0, 10), 0)
    const generated = await generateSalesPostContent(chosenService, city)
    const categoryId = await resolveCategoryId('google', 'Google')
    if (!categoryId) return { error: 'Categoria não encontrada.' }

    const slug = uniqueSlug(generated.slug)
    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .insert({
        title: generated.title,
        slug,
        content: generated.content,
        excerpt: generated.excerpt,
        status: 'review_required',
        author_id: botId,
        category_id: categoryId,
        seo_title: generated.seo_title,
        seo_description: generated.seo_description,
        seo_keywords: generated.seo_keywords,
      })
      .select('id')
      .single()
    if (error || !post) return { error: error?.message ?? 'Falha ao salvar.' }

    await supabaseAdmin.from('ai_automation_logs').insert({
      post_id: (post as { id: string }).id,
      prompt_used: `manual-sales | ${chosenService} | ${city}`,
      model_version: generated.model_used,
      raw_response: { type: 'manual_sales', service: chosenService, city } as Record<string, unknown>,
    })
    revalidatePath('/admin/posts')
    return { success: 'Rascunho de vendas gerado para revisão.', slug }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Erro inesperado na geração.' }
  }
}

/** Ações em lote nos posts (publicar / despublicar / excluir). */
export async function setPostStatus(
  postId: string,
  status: 'published' | 'draft'
): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  const patch: Record<string, unknown> = { status }
  if (status === 'published') patch.published_at = new Date().toISOString()
  const { error } = await supabaseAdmin.from('posts').update(patch).eq('id', postId)
  if (error) return { error: error.message }
  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  return { success: true }
}

export async function deletePost(postId: string): Promise<{ error: string } | { success: true }> {
  await requireAdmin()
  // logs referenciam post_id com ON DELETE SET NULL — seguro excluir o post.
  const { error } = await supabaseAdmin.from('posts').delete().eq('id', postId)
  if (error) return { error: error.message }
  revalidatePath('/admin/posts')
  revalidatePath('/blog')
  return { success: true }
}
