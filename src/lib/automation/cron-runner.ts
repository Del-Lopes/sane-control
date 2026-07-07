import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { publishScheduledPosts } from '@/lib/automation/publish-scheduler'
import { fetchNewsByTopic } from '@/lib/ai/news-curation'
import { generatePostContent } from '@/lib/ai/content-generator'
import { generateSalesPostContent } from '@/lib/ai/sales-post-generator'
import { generateAndPersistCover } from '@/lib/utils/hf-image'
import { pickService } from '@/lib/automation/sane-services'
import type {
  AutomationSettings,
  AutomationDailyRun,
  AutomationCityHistory,
} from '@/lib/db/schema'
import type { NewsArticle } from '@/lib/ai/news-curation'

// ── Timezone: América/São_Paulo (público 100% Brasil) ──
const WEEKDAY_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}
function getBrasiliaInfo(): { date: string; hour: number; dayOfWeek: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
    weekday: 'long',
  }).formatToParts(new Date())
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? '0'
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    hour: parseInt(get('hour'), 10),
    dayOfWeek: WEEKDAY_MAP[get('weekday')] ?? 0,
  }
}
// Slot 0 -> published@start ; Slot N -> scheduled@(start + N*interval)  (Brasília UTC-3)
function getPublishInfo(
  slot: number,
  dateStr: string,
  startHour: number,
  startMinute: number,
  intervalHours: number
): { status: 'published' | 'scheduled'; publishedAt: string } {
  const h = startHour + slot * intervalHours
  const pad = (n: number) => String(n).padStart(2, '0')
  const publishedAt = `${dateStr}T${pad(h)}:${pad(startMinute)}:00-03:00`
  return {
    status: slot === 0 ? 'published' : 'scheduled',
    publishedAt: new Date(publishedAt).toISOString(),
  }
}

// ── Daily run (idempotência) ──
async function getOrCreateDailyRun(
  date: string,
  type: 'news' | 'sales',
  target: number
): Promise<AutomationDailyRun> {
  const { data: existing } = await supabaseAdmin
    .from('automation_daily_runs')
    .select('*')
    .eq('run_date', date)
    .eq('run_type', type)
    .maybeSingle()
  if (existing) return existing as AutomationDailyRun
  const { data: created, error } = await supabaseAdmin
    .from('automation_daily_runs')
    .insert({ run_date: date, run_type: type, posts_target: target })
    .select('*')
    .single()
  if (error || !created)
    throw new Error(`Failed to create daily run (${type}): ${error?.message ?? 'no data'}`)
  return created as AutomationDailyRun
}
async function updateDailyRun(id: string, postsCreated: number, target: number): Promise<void> {
  await supabaseAdmin
    .from('automation_daily_runs')
    .update({
      posts_created: postsCreated,
      completed: postsCreated >= target,
      last_attempt_at: new Date().toISOString(),
    })
    .eq('id', id)
}

// ── City rotation (região prioritária Sudeste, menos usada) ──
async function getNextCity(today: string): Promise<AutomationCityHistory | null> {
  const { data: priority } = await supabaseAdmin
    .from('automation_city_history')
    .select('*')
    .eq('region', 'Sudeste')
    .or(`last_used_date.is.null,last_used_date.lt.${today}`)
    .order('last_used_date', { ascending: true, nullsFirst: true })
    .order('usage_count', { ascending: true })
    .limit(1)
    .maybeSingle()
  if (priority) return priority as AutomationCityHistory
  const { data: anyCity } = await supabaseAdmin
    .from('automation_city_history')
    .select('*')
    .or(`last_used_date.is.null,last_used_date.lt.${today}`)
    .order('last_used_date', { ascending: true, nullsFirst: true })
    .order('usage_count', { ascending: true })
    .limit(1)
    .maybeSingle()
  return (anyCity as AutomationCityHistory | null) ?? null
}
async function markCityUsed(cityId: string, currentCount: number, today: string): Promise<void> {
  await supabaseAdmin
    .from('automation_city_history')
    .update({ last_used_date: today, usage_count: currentCount + 1 })
    .eq('id', cityId)
}

async function resolveCategory(name: string, slug: string, description: string): Promise<string> {
  const { data: existing } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  if (existing) return (existing as { id: string }).id
  const { data: created, error } = await supabaseAdmin
    .from('categories')
    .insert({ name, slug, description })
    .select('id')
    .single()
  if (error || !created) throw new Error(`Failed to resolve category "${slug}": ${error?.message}`)
  return (created as { id: string }).id
}

type PipelineResult = { created: number; errors: string[]; completed: boolean }

// ── NEWS PIPELINE — tópicos do setor (casam com categorias seedadas na Fase 2) ──
const NEWS_TOPICS = ['Pragas urbanas', 'Dengue e Aedes', 'Saúde e saneamento']
const TOPIC_CATEGORY: Record<string, { name: string; slug: string; description: string }> = {
  'Pragas urbanas': {
    name: 'Pragas Urbanas',
    slug: 'pragas-urbanas',
    description: 'Baratas, ratos, cupins, escorpiões, mosquitos e outras pragas urbanas.',
  },
  'Dengue e Aedes': {
    name: 'Dengue e Arboviroses',
    slug: 'dengue-e-arboviroses',
    description: 'Aedes aegypti, dengue, zika, chikungunya e prevenção sazonal.',
  },
  'Saúde e saneamento': {
    name: 'Saúde e Saneamento',
    slug: 'saude-e-saneamento',
    description:
      'Água potável, caixa d\'água, doenças transmitidas por pragas e vigilância sanitária.',
  },
}

async function runNewsPipeline(
  run: AutomationDailyRun,
  date: string,
  startHour: number,
  startMinute: number,
  intervalHours: number
): Promise<PipelineResult> {
  const botId = process.env.AI_BOT_PROFILE_ID
  if (!botId) throw new Error('AI_BOT_PROFILE_ID env var not set')

  const topicCategoryIds = Object.fromEntries(
    await Promise.all(
      NEWS_TOPICS.map(async (topic) => {
        const cat = TOPIC_CATEGORY[topic]
        return [topic, await resolveCategory(cat.name, cat.slug, cat.description)] as [string, string]
      })
    )
  )

  const { data: existingRows } = await supabaseAdmin
    .from('posts')
    .select('source_url')
    .not('source_url', 'is', null)
  const knownUrls = new Set<string>(
    (existingRows ?? []).map((r) => (r as { source_url: string }).source_url).filter(Boolean)
  )

  let created = run.posts_created
  const errors: string[] = []
  for (let slot = run.posts_created; slot < run.posts_target; slot++) {
    let article: NewsArticle | null = null
    let foundTopic = NEWS_TOPICS[slot % NEWS_TOPICS.length]
    for (let t = 0; t < NEWS_TOPICS.length; t++) {
      const topic = NEWS_TOPICS[(slot + t) % NEWS_TOPICS.length]
      try {
        const fresh = (await fetchNewsByTopic(topic)).filter((a) => a.url && !knownUrls.has(a.url))
        if (fresh.length > 0) {
          article = fresh[0]
          foundTopic = topic
          break
        }
      } catch (err) {
        console.warn(
          `[news-pipeline] fetch failed "${topic}": ${err instanceof Error ? err.message : err}`
        )
      }
    }
    if (!article) {
      errors.push(`slot ${slot}: no fresh article found`)
      continue
    }
    knownUrls.add(article.url)
    try {
      const generated = await generatePostContent({
        title: article.title,
        url: article.url,
        description: article.description,
        density: article.density ?? 'general',
      })
      const { url: coverImage, origin: imgOrigin } = await generateAndPersistCover(
        generated.image_prompt
      )
      const { status, publishedAt } = getPublishInfo(
        slot,
        date,
        startHour,
        startMinute,
        intervalHours
      )
      const slug = `${generated.slug}-${Math.floor(Math.random() * 9000) + 1000}`
      const { data: post, error: insertErr } = await supabaseAdmin
        .from('posts')
        .insert({
          title: generated.title,
          slug,
          content: generated.content,
          excerpt: generated.excerpt,
          status,
          author_id: botId,
          category_id: topicCategoryIds[foundTopic],
          source_url: article.url,
          image_prompt: generated.image_prompt,
          cover_image: coverImage,
          seo_title: generated.seo_title,
          seo_description: generated.seo_description,
          seo_keywords: generated.seo_keywords,
          published_at: publishedAt,
        })
        .select('id')
        .single()
      if (insertErr || !post) throw new Error(insertErr?.message ?? 'no post data')
      await supabaseAdmin.from('ai_automation_logs').insert({
        post_id: (post as { id: string }).id,
        prompt_used: article.url,
        model_version: generated.model_used,
        token_usage: null,
        raw_response: {
          type: 'auto_news',
          topic: foundTopic,
          slot,
          imageOrigin: imgOrigin,
        } as Record<string, unknown>,
      })
      created++
    } catch (err) {
      errors.push(`slot ${slot}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  await updateDailyRun(run.id, created, run.posts_target)
  return { created: created - run.posts_created, errors, completed: created >= run.posts_target }
}

// ── SALES PIPELINE — categoria oculta 'google'; serviço via pickService ──
async function runSalesPipeline(
  run: AutomationDailyRun,
  date: string,
  startHour: number,
  startMinute: number,
  intervalHours: number
): Promise<PipelineResult> {
  const botId = process.env.AI_BOT_PROFILE_ID
  if (!botId) throw new Error('AI_BOT_PROFILE_ID env var not set')
  const categoryId = await resolveCategory(
    'Google',
    'google',
    'Artigos de vendas para SEO local — não exibidos no blog'
  )

  let created = run.posts_created
  const errors: string[] = []
  for (let slot = run.posts_created; slot < run.posts_target; slot++) {
    try {
      const city = await getNextCity(date)
      if (!city) {
        errors.push(`slot ${slot}: no city available`)
        break
      }
      const service = pickService(date, slot)
      const cityLabel = `${city.city}, ${city.state_code}`
      const generated = await generateSalesPostContent(service, cityLabel)
      const { status, publishedAt } = getPublishInfo(
        slot,
        date,
        startHour,
        startMinute,
        intervalHours
      )
      const slug = `${generated.slug}-${Math.floor(Math.random() * 9000) + 1000}`
      const { data: post, error: insertErr } = await supabaseAdmin
        .from('posts')
        .insert({
          title: generated.title,
          slug,
          content: generated.content,
          excerpt: generated.excerpt,
          status,
          author_id: botId,
          category_id: categoryId,
          source_url: null,
          image_prompt: null,
          cover_image: null,
          seo_title: generated.seo_title,
          seo_description: generated.seo_description,
          seo_keywords: generated.seo_keywords,
          published_at: publishedAt,
        })
        .select('id')
        .single()
      if (insertErr || !post) throw new Error(insertErr?.message ?? 'no post data')
      await markCityUsed(city.id, city.usage_count, date)
      await supabaseAdmin.from('ai_automation_logs').insert({
        post_id: (post as { id: string }).id,
        prompt_used: `auto-sales | serviço: ${service} | cidade: ${cityLabel}`,
        model_version: generated.model_used,
        token_usage: null,
        raw_response: {
          type: 'auto_sales',
          service,
          city: city.city,
          state: city.state_code,
          region: city.region,
          slot,
        } as Record<string, unknown>,
      })
      created++
    } catch (err) {
      errors.push(`slot ${slot}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  await updateDailyRun(run.id, created, run.posts_target)
  return { created: created - run.posts_created, errors, completed: created >= run.posts_target }
}

// ── ENTRY POINT ──
export type AutomationRunResult =
  | { skipped: string; scheduledPublished: number }
  | {
      ok: true
      date: string
      scheduledPublished: number
      news?: PipelineResult
      sales?: PipelineResult
    }

export async function runAutomation(): Promise<AutomationRunResult> {
  const scheduledPublished = await publishScheduledPosts()
  const { data: settings, error } = await supabaseAdmin
    .from('automation_settings')
    .select('*')
    .maybeSingle()
  if (error || !settings)
    throw new Error(`Failed to load automation settings: ${error?.message ?? 'no row found'}`)
  const cfg = settings as AutomationSettings
  if (!cfg.is_enabled) return { skipped: 'automation_disabled', scheduledPublished }

  const { date, hour, dayOfWeek } = getBrasiliaInfo()
  if (!cfg.active_days.includes(dayOfWeek))
    return { skipped: `inactive_day (${dayOfWeek})`, scheduledPublished }
  if (hour < cfg.cron_start_hour)
    return { skipped: `too_early (${hour}h < ${cfg.cron_start_hour}h)`, scheduledPublished }

  const [newsRun, salesRun] = await Promise.all([
    cfg.news_posts_per_day > 0 ? getOrCreateDailyRun(date, 'news', cfg.news_posts_per_day) : null,
    cfg.sales_posts_per_day > 0 ? getOrCreateDailyRun(date, 'sales', cfg.sales_posts_per_day) : null,
  ])
  const newsComplete = !newsRun || newsRun.completed
  const salesComplete = !salesRun || salesRun.completed
  if (newsComplete && salesComplete)
    return { skipped: 'daily_goal_already_met', scheduledPublished }

  const result: {
    ok: true
    date: string
    scheduledPublished: number
    news?: PipelineResult
    sales?: PipelineResult
  } = { ok: true, date, scheduledPublished }
  if (newsRun && !newsRun.completed)
    result.news = await runNewsPipeline(
      newsRun,
      date,
      cfg.cron_start_hour,
      cfg.cron_start_minute,
      cfg.post_interval_hours
    )
  if (salesRun && !salesRun.completed)
    result.sales = await runSalesPipeline(
      salesRun,
      date,
      cfg.cron_start_hour,
      cfg.cron_start_minute,
      cfg.post_interval_hours
    )
  return result
}
