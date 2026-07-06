import { createClient } from '@supabase/supabase-js'
import type { Database } from './schema'

// service-role — BYPASSA RLS. Somente server (cron, server actions privilegiadas).
// NUNCA importar em Client Components.
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
