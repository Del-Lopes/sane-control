'use server'

import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
export type LoginState = { error: string } | null

// Rate limiting (in-memory, por processo) — previne brute-force
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()

function isLoginRateLimited(email: string): boolean {
  const key = email.toLowerCase()
  const now = Date.now()
  const entry = loginAttempts.get(key)
  if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttempt: now })
    return false
  }
  entry.count++
  return entry.count > RATE_LIMIT_MAX
}
function resetLoginAttempts(email: string): void {
  loginAttempts.delete(email.toLowerCase())
}

// Usado com useActionState no LoginForm: (prevState, formData) => state
export const loginAction = async (
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> => {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })
  const INVALID = { error: 'Credenciais inválidas.' } // erro genérico — evita enumeração de usuários
  if (!parsed.success) return INVALID
  if (isLoginRateLimited(parsed.data.email))
    return { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })
  if (error || !data.user) return INVALID

  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()
  const profile = profileData as { role: string } | null
  if (!profile || !['admin', 'editor'].includes(profile.role)) {
    await supabase.auth.signOut()
    return INVALID
  }

  resetLoginAttempts(parsed.data.email)
  redirect('/admin/posts')
}

export const logoutAction = async (): Promise<void> => {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  const cookieStore = await cookies()
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.includes('sb-') || cookie.name.includes('supabase'))
      cookieStore.delete(cookie.name)
  }
  redirect('/admin/login')
}
