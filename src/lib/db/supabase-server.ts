import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './schema'

// SSR por cookie (respeita RLS). Usar em Server Components / server actions.
export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
              })
            )
          } catch {
            // setAll chamado de um Server Component — seguro ignorar (middleware renova a sessão)
          }
        },
      },
    }
  )
}
