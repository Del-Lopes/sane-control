-- =====================================================================
-- Migration 0001 — Schema base do blog automático (Fase 2 do ROADMAP_AUTO_BLOG)
-- Enums, tabelas, índices, RLS e trigger de profiles on signup.
-- Cole INTEIRO no SQL Editor do Supabase (os blocos $func$..$func$ são
-- delimitadores de corpo de função do Postgres — cole como estão).
-- =====================================================================

-- ==== Enums ====
create type user_role as enum ('admin', 'editor', 'ai_bot');
create type post_status as enum ('draft','published','scheduled','ai_generating','review_required');

-- ==== profiles (espelho de auth.users) ====
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  avatar_url text,
  role user_role not null default 'editor',
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger: cria profile automaticamente quando um auth.user é criado
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $func$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end; $func$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ==== categories ====
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  created_at timestamptz not null default now()
);

-- ==== posts ====
create table posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,               -- HTML
  excerpt text,
  cover_image text,
  author_id uuid not null references profiles(id),
  category_id uuid not null references categories(id),
  status post_status not null default 'draft',
  seo_title text,
  seo_description text,
  seo_keywords text[],
  image_prompt text,
  source_url text,                      -- dedup de notícias
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_status_published_idx on posts (status, published_at desc);
create index posts_source_url_idx on posts (source_url);

-- ==== automation_settings (linha única / singleton) ====
create table automation_settings (
  id uuid primary key default gen_random_uuid(),
  cron_start_hour int not null default 8 check (cron_start_hour between 0 and 23),
  cron_start_minute int not null default 0 check (cron_start_minute between 0 and 59),
  active_days int[] not null default '{1,2,3,4,5}',   -- 0=Dom ... 6=Sab
  news_posts_per_day int not null default 1,
  sales_posts_per_day int not null default 1,
  post_interval_hours int not null default 4 check (post_interval_hours between 1 and 23),
  is_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

-- ==== automation_daily_runs (idempotência) ====
create table automation_daily_runs (
  id uuid primary key default gen_random_uuid(),
  run_date date not null,
  run_type text not null check (run_type in ('news','sales')),
  posts_created int not null default 0,
  posts_target int not null,
  completed boolean not null default false,
  last_attempt_at timestamptz,
  created_at timestamptz not null default now(),
  unique (run_date, run_type)
);

-- ==== automation_city_history (rotação de cidades) ====
create table automation_city_history (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  state text not null,
  state_code text not null,
  region text not null,
  last_used_date date,
  usage_count int not null default 0
);

-- ==== ai_automation_logs (auditoria) ====
create table ai_automation_logs (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete set null,
  prompt_used text not null,
  model_version text not null,
  token_usage int,
  raw_response jsonb,
  generation_date timestamptz not null default now()
);

-- ==== RLS ====
alter table profiles enable row level security;
alter table categories enable row level security;
alter table posts enable row level security;
alter table automation_settings enable row level security;
alter table automation_daily_runs enable row level security;
alter table automation_city_history enable row level security;
alter table ai_automation_logs enable row level security;

-- Leitura pública só de conteúdo publicado
create policy "public reads published posts" on posts
  for select using (status = 'published');
create policy "public reads categories" on categories
  for select using (true);

-- profiles: dono lê/edita o próprio
create policy "own profile read" on profiles
  for select using (auth.uid() = id);
create policy "own profile update" on profiles
  for update using (auth.uid() = id);

-- Tabelas de automação: nenhuma policy anônima (só service-role, que ignora RLS).
-- (O cron usa o admin client / service-role e bypassa todas as policies acima.)
