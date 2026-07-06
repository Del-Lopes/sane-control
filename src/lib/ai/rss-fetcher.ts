import Parser from 'rss-parser'
import type { NewsArticle } from './news-curation'

const FEED_TIMEOUT_MS = 7000
const UA = 'Mozilla/5.0 (compatible; SaneControlBot/1.0; +https://www.sanecontrol.com.br)'

const parser = new Parser({
  headers: {
    'User-Agent': UA,
    Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
  },
})

export async function fetchRSSFeed(url: string): Promise<NewsArticle[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': UA,
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      },
    })
    if (!res.ok) {
      console.warn(`[rss-fetcher] HTTP ${res.status} for ${url}`)
      return []
    }
    const text = await res.text()
    const feed = await parser.parseString(text)
    const sourceName = feed.title?.trim() || new URL(url).hostname.replace(/^www\./, '')
    return (feed.items ?? []).slice(0, 20).flatMap((item) => {
      const title = item.title?.trim() ?? ''
      const link = item.link?.trim() ?? ''
      if (!title || !link) return []
      return [
        {
          title,
          url: link,
          description: item.contentSnippet?.trim() ?? item.summary?.trim() ?? '',
          source: sourceName,
          publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
        },
      ]
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[rss-fetcher] Failed ${url}: ${msg.slice(0, 80)}`)
    return []
  } finally {
    clearTimeout(timer)
  }
}

export async function fetchMultipleFeeds(urls: string[]): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(urls.map(fetchRSSFeed))
  return results
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
}
