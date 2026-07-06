import { Client } from '@gradio/client'
import { fetchUnsplashImage } from '@/lib/utils/image-providers'

export const DEFAULT_COVER = '/images/default-cover.svg'
export type ImageOrigin = 'flux' | 'imagen4' | 'unsplash' | 'default'
export type CoverImageResult = { url: string; origin: ImageOrigin }

const TIMEOUT_MS = 35_000,
  MAX_RETRIES = 3
const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    p,
    new Promise<never>((_, r) => setTimeout(() => r(new Error('HF request timeout')), ms)),
  ])
const isRateLimitError = (err: unknown): boolean => {
  const m = (err instanceof Error ? err.message : String(err)).toLowerCase()
  return ['rate', 'quota', 'limit', 'exceeded', 'too many'].some((k) => m.includes(k))
}
const extractImageUrl = (data: unknown): string | null => {
  if (!data) return null
  const item = Array.isArray(data) ? data[0] : data
  if (typeof item === 'string' && item.startsWith('http')) return item
  if (typeof item === 'object' && item !== null) {
    const o = item as Record<string, unknown>
    if (typeof o.url === 'string') return o.url
    if (typeof o.path === 'string') return o.path
  }
  return null
}

const tryFluxPrimary = async (prompt: string): Promise<string | null> => {
  const token = process.env.HF_TOKEN as `hf_${string}` | undefined
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const client = await withTimeout(
        Client.connect('black-forest-labs/FLUX.2-klein-4B', { token }),
        TIMEOUT_MS
      )
      const result = await withTimeout(
        client.predict('/infer', {
          prompt,
          input_images: [],
          mode_choice: 'Distilled (4 steps)',
          seed: 0,
          randomize_seed: true,
          width: 1024,
          height: 1024,
          num_inference_steps: 4,
          guidance_scale: 3,
          prompt_upsampling: false,
        }),
        TIMEOUT_MS
      )
      const url = extractImageUrl(result.data)
      if (url) return url
    } catch (err) {
      if (isRateLimitError(err)) return null
    }
  }
  return null
}
const tryFluxBackup = async (prompt: string): Promise<string | null> => {
  const token = process.env.HF_TOKEN as `hf_${string}` | undefined
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const client = await withTimeout(
        Client.connect('llamameta/Fake-FLUX-Pro-Unlimited', { token }),
        TIMEOUT_MS
      )
      const result = await withTimeout(
        client.predict('/generate_image', { prompt, model: 'imagen-4-ultra' }),
        TIMEOUT_MS
      )
      const url = extractImageUrl(result.data)
      if (url) return url
    } catch (err) {
      if (isRateLimitError(err)) return null
    }
  }
  return null
}

export const generateCoverImage = async (prompt: string): Promise<CoverImageResult> => {
  const primary = await tryFluxPrimary(prompt)
  if (primary) return { url: primary, origin: 'flux' }
  const backup = await tryFluxBackup(prompt)
  if (backup) return { url: backup, origin: 'imagen4' }
  const unsplash = await fetchUnsplashImage(prompt)
  if (unsplash) return { url: unsplash, origin: 'unsplash' }
  return { url: DEFAULT_COVER, origin: 'default' }
}
