import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// service-role — BYPASSA RLS. Somente server (cron, server actions privilegiadas).
// NUNCA importar em Client Components.
//
// Inicialização PREGUIÇOSA: o client só é criado (e as envs validadas) no primeiro
// uso em runtime — não na importação do módulo. Isso evita quebrar o BUILD do Next
// ("Collecting page data") quando SUPABASE_SERVICE_ROLE_KEY não está disponível na
// etapa de build. Em runtime, se faltar a env, aí sim lançamos erro claro.
//
// Nota de tipagem: usado pela automação com row-objects explícitos; sem o generic
// Database (que fazia o supabase-js colapsar inserts/updates para `never`).
let _client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (_client) return _client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceKey) throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY')
  _client = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return _client
}

// Proxy: qualquer acesso a `supabaseAdmin.<algo>` resolve o client real sob demanda.
// Mantém a API existente (`supabaseAdmin.from(...)`, `supabaseAdmin.storage`, etc.).
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getClient()
    const value = Reflect.get(client as object, prop, receiver)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
