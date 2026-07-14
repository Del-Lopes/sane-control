import Groq from 'groq-sdk'
import { gemini, gemma, gemma4, MODEL_NAMES } from '@/lib/ai/google-ai-client'
import { generateSaneClosing } from '@/lib/ai/sane-closing'
import { z } from 'zod'

const GeneratedPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  seo_keywords: z.array(z.string()),
  image_prompt: z.string(),
})
export type GeneratedPost = z.infer<typeof GeneratedPostSchema> & { model_used: string }

const SYSTEM_PROMPT = `You are an expert content writer specializing in environmental sanitation, Integrated Pest Management (IPM), public health and sanitation for the Brazilian market, writing for the blog of Sane Control (an environmental sanitation company serving São Paulo and its metropolitan region since 2009, compliant with ANVISA's RDC 622/2022).
Given a reference article, write an original, informative and reassuring journalistic article in Brazilian Portuguese (pt-BR), aimed at homeowners, condominiums and businesses.
Do NOT invent statistics, certifications, or company data. Focus on prevention, health and practical guidance.
COMPLIANCE (ANVISA RDC 622/2022 — mandatory): NEVER use the Portuguese terms "seguro", "atóxico", "inócuo", "produto natural", or "sem riscos". Prefer "baixa toxicidade", "Manejo Integrado de Pragas (MIP)", "segurança operacional" and "saneantes". Keep a professional, technical yet friendly tone, without alarmism.
Return ONLY a valid JSON object — no markdown, no extra text.`

const buildUserPrompt = (article: { title: string; url: string; description: string }) =>
  `
Write an original journalistic article in Brazilian Portuguese (pt-BR) based on this source:

Original title: ${article.title}
URL: ${article.url}
Summary: ${article.description}

Return a JSON with EXACTLY these fields (no extra fields):
{
  "title": "article title in Brazilian Portuguese (max 80 characters)",
  "slug": "title-in-kebab-case-no-accents-no-special-characters",
  "content": "full content in semantic HTML using <h2>, <h3>, <p>, <ul>/<ol> where applicable, minimum 400 words. Do NOT include <html>, <head>, <body> or <script> tags. Write in Brazilian Portuguese.",
  "excerpt": "one short sentence summary in Brazilian Portuguese (max 160 characters)",
  "seo_title": "SEO-optimized title in Brazilian Portuguese (max 60 characters)",
  "seo_description": "descriptive meta description in Brazilian Portuguese (max 160 characters)",
  "seo_keywords": ["keyword-1", "keyword-2", "keyword-3", "keyword-4"],
  "image_prompt": "English description for cover image generation — a clean, professional, non-alarming photo related to pest control, home hygiene, clean water or a healthy Brazilian home/environment. No insects in a disgusting way; conceptual and tasteful."
}
`.trim()

const stripScriptTags = (t: string): string =>
  t.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
const parseJsonText = (raw: string): unknown =>
  JSON.parse(
    raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()
  )

type ModelRunner = { label: string; run: () => Promise<string> }
type Article = { title: string; url: string; description: string }

const llamaRunner = (a: Article): ModelRunner => ({
  label: 'llama-3.3-70b-versatile',
  run: async () => {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY não configurada')
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const c = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(a) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    })
    return c.choices[0]?.message?.content ?? ''
  },
})
const geminiRunner = (a: Article): ModelRunner => ({
  label: MODEL_NAMES.content,
  run: async () =>
    (
      await gemini.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(a)}` }] }],
      })
    ).response.text(),
})
const gemmaRunner = (a: Article): ModelRunner => ({
  label: MODEL_NAMES.gemma,
  run: async () =>
    (
      await gemma.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(a)}` }] }],
      })
    ).response.text(),
})
const gemma4Runner = (a: Article): ModelRunner => ({
  label: MODEL_NAMES.gemma4,
  run: async () =>
    (
      await gemma4.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(a)}` }] }],
      })
    ).response.text(),
})

function buildRunners(a: Article, density: 'dense' | 'general'): ModelRunner[] {
  if (density === 'dense') return [llamaRunner(a), gemmaRunner(a), gemma4Runner(a)]
  return [geminiRunner(a), gemmaRunner(a), gemma4Runner(a)]
}

const MAX_ATTEMPTS = 3
export const generatePostContent = async (
  article: Article & { density?: 'dense' | 'general' }
): Promise<GeneratedPost> => {
  const density = article.density ?? 'general'
  const runners = buildRunners(article, density)
  let lastError: Error = new Error('Nenhuma tentativa realizada')
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const runner = runners[i % runners.length]
    try {
      const parsed = GeneratedPostSchema.safeParse(parseJsonText(await runner.run()))
      if (!parsed.success) throw new Error(`Formato inválido: ${parsed.error.issues[0]?.message}`)
      const cleanContent = stripScriptTags(parsed.data.content)
      const closing = await generateSaneClosing(
        parsed.data.title,
        parsed.data.excerpt,
        article.description
      )
      return {
        ...parsed.data,
        content: `${cleanContent}\n${closing}`,
        excerpt: stripScriptTags(parsed.data.excerpt),
        title: stripScriptTags(parsed.data.title),
        model_used: runner.label,
      }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.warn(
        `[content-generator] ${runner.label} falhou (${i + 1}/${MAX_ATTEMPTS}): ${lastError.message}`
      )
    }
  }
  throw new Error(
    `Todos os modelos falharam após ${MAX_ATTEMPTS} tentativas. Último erro: ${lastError.message}`
  )
}
