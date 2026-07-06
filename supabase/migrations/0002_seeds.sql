-- =====================================================================
-- Migration 0002 — Seeds (adaptados à Sane Control via PERFIL-DO-NEGOCIO.md)
-- Categorias do setor + categoria oculta de vendas + singleton de settings
-- + cidades da região atendida (RMSP, validadas pelo usuário em 2026-07-06).
-- Rode DEPOIS da 0001. É idempotente (on conflict do nothing).
-- =====================================================================

-- ==== Categorias do blog (temas do setor — controle de pragas / saúde) ====
insert into categories (name, slug, description) values
  ('Pragas Urbanas',        'pragas-urbanas',        'Baratas, ratos, cupins, escorpiões, mosquitos e outras pragas urbanas.'),
  ('Prevenção',             'prevencao',             'Hábitos e cuidados para prevenir infestações e manter o ambiente saudável.'),
  ('Saúde e Saneamento',    'saude-e-saneamento',    'Água potável, caixa d''água, doenças transmitidas por pragas e vigilância sanitária.'),
  ('Dengue e Arboviroses',  'dengue-e-arboviroses',  'Aedes aegypti, dengue, zika, chikungunya e prevenção sazonal.'),
  ('Condomínios e Empresas','condominios-e-empresas','Controle sanitário, conformidade e dedetização em ambientes coletivos.')
on conflict (slug) do nothing;

-- ==== Categoria oculta de vendas (não exibida no blog — SEO local por cidade×serviço) ====
insert into categories (name, slug, description)
  values ('Google', 'google', 'Artigos de vendas para SEO local — não exibidos na listagem do blog.')
on conflict (slug) do nothing;

-- ==== Linha singleton de automation_settings ====
-- Começa DESLIGADA (is_enabled=false). Metas conservadoras (1 news + 1 sales/dia).
insert into automation_settings
  (cron_start_hour, cron_start_minute, active_days, news_posts_per_day, sales_posts_per_day, post_interval_hours, is_enabled)
select 8, 0, '{1,2,3,4,5}', 1, 1, 4, false
where not exists (select 1 from automation_settings);

-- ==== Cidades da região atendida (RMSP + eixo Caieiras — validado 2026-07-06) ====
-- Sem isso o pipeline de vendas (runSalesPipeline) não roda. region='Sudeste' é a chave de rotação.
insert into automation_city_history (city, state, state_code, region) values
  ('Caieiras',              'São Paulo', 'SP', 'Sudeste'),
  ('São Paulo',             'São Paulo', 'SP', 'Sudeste'),
  ('Franco da Rocha',       'São Paulo', 'SP', 'Sudeste'),
  ('Francisco Morato',      'São Paulo', 'SP', 'Sudeste'),
  ('Mairiporã',             'São Paulo', 'SP', 'Sudeste'),
  ('Cajamar',               'São Paulo', 'SP', 'Sudeste'),
  ('Guarulhos',             'São Paulo', 'SP', 'Sudeste'),
  ('Osasco',                'São Paulo', 'SP', 'Sudeste'),
  ('Barueri',               'São Paulo', 'SP', 'Sudeste'),
  ('Santana de Parnaíba',   'São Paulo', 'SP', 'Sudeste'),
  ('Perus',                 'São Paulo', 'SP', 'Sudeste'),
  ('Jundiaí',               'São Paulo', 'SP', 'Sudeste');
