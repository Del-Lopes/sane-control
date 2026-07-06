/**
 * Helpers de autorização reutilizáveis (Server Components / server actions).
 * Padrão do roadmap [B-6.2]: valida o usuário no servidor Auth (getUser, não getSession)
 * e confere o role em profiles. requireAdmin() redireciona se não autorizado.
 */
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import type { UserRole } from '@/lib/db/schema'

export type AuthedProfile = {
  id: string
  email: string | undefined
  full_name: string
  role: UserRole
}

/** Retorna o profile autenticado, ou null se não logado / sem profile. */
export async function getAuthedProfile(): Promise<AuthedProfile | null> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', user.id)
    .maybeSingle()

  const profile = data as Pick<
    import('@/lib/db/schema').Profile,
    'id' | 'full_name' | 'role'
  > | null

  if (!profile) return null
  return {
    id: profile.id,
    email: user.email,
    full_name: profile.full_name,
    role: profile.role,
  }
}

/**
 * Exige um usuário com role admin/editor. Redireciona para /admin/login se não
 * autenticado, ou para /admin/login?error=forbidden se autenticado sem permissão.
 * Retorna o profile para uso na página.
 */
export async function requireAdmin(
  allowed: UserRole[] = ['admin', 'editor']
): Promise<AuthedProfile> {
  const profile = await getAuthedProfile()
  if (!profile) redirect('/admin/login')
  if (!allowed.includes(profile.role)) redirect('/admin/login?error=forbidden')
  return profile
}
