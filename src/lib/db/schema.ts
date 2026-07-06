/**
 * Tipos do banco (Supabase). Espelhados à mão conforme o DDL da Fase 2 (roadmap [B-2.1]).
 * O tipo `Database` é usado pelos clientes genéricos createClient<Database>.
 * Pode ser regenerado com `supabase gen types typescript` após aplicar as migrations.
 */

export type UserRole = 'admin' | 'editor' | 'ai_bot'
export type PostStatus =
  | 'draft'
  | 'published'
  | 'scheduled'
  | 'ai_generating'
  | 'review_required'

export type Profile = {
  id: string
  full_name: string
  avatar_url: string | null
  role: UserRole
  bio: string | null
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export type Post = {
  id: string
  title: string
  slug: string
  content: string // HTML
  excerpt: string | null
  cover_image: string | null
  author_id: string
  category_id: string
  status: PostStatus
  seo_title: string | null
  seo_description: string | null
  seo_keywords: string[] | null
  image_prompt: string | null
  source_url: string | null // dedup de notícias
  published_at: string | null
  created_at: string
  updated_at: string
}

export type AutomationSettings = {
  id: string
  cron_start_hour: number
  cron_start_minute: number
  active_days: number[]
  news_posts_per_day: number
  sales_posts_per_day: number
  post_interval_hours: number
  is_enabled: boolean
  updated_at: string
}

export type AutomationDailyRun = {
  id: string
  run_date: string
  run_type: 'news' | 'sales'
  posts_created: number
  posts_target: number
  completed: boolean
  last_attempt_at: string | null
  created_at: string
}

export type AutomationCityHistory = {
  id: string
  city: string
  state: string
  state_code: string
  region: string
  last_used_date: string | null
  usage_count: number
}

export type AiAutomationLog = {
  id: string
  post_id: string | null
  prompt_used: string
  model_version: string
  token_usage: number | null
  raw_response: Record<string, unknown> | null
  generation_date: string
}

/**
 * Shape do banco para tipar createClient<Database>. Cada tabela declara Row/Insert/Update.
 * Insert torna opcionais as colunas com default no DDL; mantemos simples e permissivo.
 */
type Timestamped = 'created_at' | 'updated_at'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, Timestamped> & Partial<Pick<Profile, Timestamped>>
        Update: Partial<Profile>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id' | 'created_at'> &
          Partial<Pick<Category, 'id' | 'created_at'>>
        Update: Partial<Category>
      }
      posts: {
        Row: Post
        Insert: Omit<Post, 'id' | Timestamped> &
          Partial<Pick<Post, 'id' | Timestamped>>
        Update: Partial<Post>
      }
      automation_settings: {
        Row: AutomationSettings
        Insert: Omit<AutomationSettings, 'id' | 'updated_at'> &
          Partial<Pick<AutomationSettings, 'id' | 'updated_at'>>
        Update: Partial<AutomationSettings>
      }
      automation_daily_runs: {
        Row: AutomationDailyRun
        Insert: Omit<AutomationDailyRun, 'id' | 'created_at'> &
          Partial<Pick<AutomationDailyRun, 'id' | 'created_at'>>
        Update: Partial<AutomationDailyRun>
      }
      automation_city_history: {
        Row: AutomationCityHistory
        Insert: Omit<AutomationCityHistory, 'id'> &
          Partial<Pick<AutomationCityHistory, 'id'>>
        Update: Partial<AutomationCityHistory>
      }
      ai_automation_logs: {
        Row: AiAutomationLog
        Insert: Omit<AiAutomationLog, 'id' | 'generation_date'> &
          Partial<Pick<AiAutomationLog, 'id' | 'generation_date'>>
        Update: Partial<AiAutomationLog>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      post_status: PostStatus
    }
  }
}
