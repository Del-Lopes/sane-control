import { GoogleGenerativeAI } from '@google/generative-ai'

// ⚠️ Nomes de modelo: validar na Fase 5 ao vivo (Risco #2 do roadmap). Alguns nomes
// "preview" do código de referência podem não existir na key. Usamos nomes estáveis
// do free tier; se algum retornar 404, trocar aqui (ponto único de verdade).
export const MODEL_NAMES = {
  content: 'gemini-2.0-flash',
  gemma: 'gemma-2-27b-it',
  gemma4: 'gemini-2.0-flash-lite',
} as const

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY não configurada')
}

// Conta 1 — escrita de conteúdo + fallback de ranking
const ai1 = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
export const gemini = ai1.getGenerativeModel({ model: MODEL_NAMES.content })
export const gemma = ai1.getGenerativeModel({ model: MODEL_NAMES.gemma })
export const gemma4 = ai1.getGenerativeModel({ model: MODEL_NAMES.gemma4 })

// Conta 2 — curadoria (null quando a key não está setada = degradação graciosa)
const ai2 = process.env.GOOGLE_AI_API_KEY_SEARCH
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY_SEARCH)
  : null

export type CurationModel = {
  label: string
  model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>
}
export const curationModels: CurationModel[] = ai2
  ? [
      { label: 'Gemini Flash', model: ai2.getGenerativeModel({ model: MODEL_NAMES.content }) },
      { label: 'Gemini Flash Lite', model: ai2.getGenerativeModel({ model: MODEL_NAMES.gemma4 }) },
    ]
  : []
export const geminiSearch = ai2
  ? ai2.getGenerativeModel({ model: MODEL_NAMES.content })
  : null
