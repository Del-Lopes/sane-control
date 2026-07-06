'use server'

import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { revalidatePath } from 'next/cache'
import type { AutomationSettings } from '@/lib/db/schema'

export async function getAutomationSettings(): Promise<AutomationSettings | null> {
  const { data } = await supabaseAdmin.from('automation_settings').select('*').maybeSingle()
  return (data as AutomationSettings | null) ?? null
}

export type SaveSettingsResult = { error: string } | { success: true } | null

export async function saveAutomationSettingsAction(
  _prev: SaveSettingsResult,
  formData: FormData
): Promise<SaveSettingsResult> {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  const profile = profileData as { role: string } | null
  if (profile?.role !== 'admin') return { error: 'Apenas administradores podem alterar' }

  const startHour = parseInt(formData.get('cron_start_hour') as string, 10)
  const startMinute = parseInt(formData.get('cron_start_minute') as string, 10)
  const intervalHours = parseInt(formData.get('post_interval_hours') as string, 10)
  const newsPerDay = parseInt(formData.get('news_posts_per_day') as string, 10)
  const salesPerDay = parseInt(formData.get('sales_posts_per_day') as string, 10)
  const isEnabled = formData.get('is_enabled') === 'on'
  const activeDays = [0, 1, 2, 3, 4, 5, 6].filter((d) => formData.get(`day_${d}`) === 'on')

  if (isNaN(startHour) || startHour < 0 || startHour > 23) return { error: 'Horário inválido (0-23)' }
  if (isNaN(startMinute) || startMinute < 0 || startMinute > 59)
    return { error: 'Minutos inválidos (0-59)' }
  if (isNaN(intervalHours) || intervalHours < 1 || intervalHours > 23)
    return { error: 'Intervalo inválido (1-23h)' }
  if (isNaN(newsPerDay) || newsPerDay < 0 || newsPerDay > 20)
    return { error: 'Notícias/dia inválido (0-20)' }
  if (isNaN(salesPerDay) || salesPerDay < 0 || salesPerDay > 20)
    return { error: 'Vendas/dia inválido (0-20)' }
  if (activeDays.length === 0) return { error: 'Selecione pelo menos um dia ativo' }

  // Todos os slots devem caber no mesmo dia (< 24h)
  const numSlots = Math.max(newsPerDay, salesPerDay)
  if (numSlots > 1 && startHour + (numSlots - 1) * intervalHours >= 24) {
    return {
      error: 'Agendamento incompatível: o último post passaria da meia-noite. Reduza posts ou intervalo.',
    }
  }

  const { data: current } = await supabaseAdmin
    .from('automation_settings')
    .select('id')
    .maybeSingle()
  if (!current) return { error: 'Configurações não encontradas — rode as migrations' }
  const { error } = await supabaseAdmin
    .from('automation_settings')
    .update({
      cron_start_hour: startHour,
      cron_start_minute: startMinute,
      post_interval_hours: intervalHours,
      active_days: activeDays,
      news_posts_per_day: newsPerDay,
      sales_posts_per_day: salesPerDay,
      is_enabled: isEnabled,
    })
    .eq('id', (current as { id: string }).id)
  if (error) return { error: error.message }
  revalidatePath('/admin/automation/settings')
  return { success: true }
}
