import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai'

// ⚠️ Nomes de modelo: validar na Fase 5 ao vivo (Risco #2 do roadmap). Alguns nomes
// "preview" do código de referência podem não existir na key. Usamos nomes estáveis
// do free tier; se algum retornar 404, trocar aqui (ponto único de verdade).
// Validados ao vivo na key do cliente em 2026-07-07 (os 2.0-flash* estavam
// RESOURCE_EXHAUSTED e os gemma-4* davam INTERNAL). Estes 3 respondem OK.
export const MODEL_NAMES = {
  content: 'gemini-2.5-flash',
  gemma: 'gemini-2.5-flash-lite',
  gemma4: 'gemini-flash-lite-latest',
} as const

// Inicialização PREGUIÇOSA: a key só é lida (e validada) no primeiro uso em runtime —
// não na importação do módulo. Evita quebrar o BUILD do Next quando GOOGLE_AI_API_KEY
// não está disponível na etapa de build (o cron-runner importa este módulo).
let _ai1: GoogleGenerativeAI | null = null
function ai1(): GoogleGenerativeAI {
  if (_ai1) return _ai1
  const key = process.env.GOOGLE_AI_API_KEY
  if (!key) throw new Error('GOOGLE_AI_API_KEY não configurada')
  _ai1 = new GoogleGenerativeAI(key)
  return _ai1
}

// Proxy que resolve o GenerativeModel sob demanda (mantém a API model.generateContent).
function lazyModel(name: string): GenerativeModel {
  let cached: GenerativeModel | null = null
  const resolve = (): GenerativeModel => {
    if (!cached) cached = ai1().getGenerativeModel({ model: name })
    return cached
  }
  return new Proxy({} as GenerativeModel, {
    get(_t, prop, receiver) {
      const m = resolve()
      const value = Reflect.get(m as object, prop, receiver)
      return typeof value === 'function' ? value.bind(m) : value
    },
  })
}

// Conta 1 — escrita de conteúdo + fallback de ranking
export const gemini = lazyModel(MODEL_NAMES.content)
export const gemma = lazyModel(MODEL_NAMES.gemma)
export const gemma4 = lazyModel(MODEL_NAMES.gemma4)

// Conta 2 — curadoria (null quando a key não está setada = degradação graciosa).
// Também preguiçosa: só instancia no primeiro acesso.
let _ai2Resolved = false
let _ai2: GoogleGenerativeAI | null = null
function ai2(): GoogleGenerativeAI | null {
  if (_ai2Resolved) return _ai2
  _ai2Resolved = true
  _ai2 = process.env.GOOGLE_AI_API_KEY_SEARCH
    ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY_SEARCH)
    : null
  return _ai2
}

export type CurationModel = { label: string; model: GenerativeModel }

export function getCurationModels(): CurationModel[] {
  const client = ai2()
  if (!client) return []
  return [
    { label: 'Gemini Flash', model: client.getGenerativeModel({ model: MODEL_NAMES.content }) },
    { label: 'Gemini Flash Lite', model: client.getGenerativeModel({ model: MODEL_NAMES.gemma4 }) },
  ]
}

export function getGeminiSearch(): GenerativeModel | null {
  const client = ai2()
  return client ? client.getGenerativeModel({ model: MODEL_NAMES.content }) : null
}
