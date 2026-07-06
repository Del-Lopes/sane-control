import { createClient } from '@supabase/supabase-js'

// service-role — BYPASSA RLS. Somente server (cron, server actions privilegiadas).
// NUNCA importar em Client Components.
//
// Nota de tipagem: o client admin é usado pela automação com row-objects explícitos
// (inserts/updates de posts, logs, runs). O tipo genérico Database faz o supabase-js
// colapsar payloads de insert/update para `never`; como aqui todas as escritas já
// declaram a forma exata da linha, deixamos o client sem o generic para não travar.
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
