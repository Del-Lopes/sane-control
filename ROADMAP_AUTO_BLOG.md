# Roadmap Portável — Feature de Postagem Automática no Blog com IA

> **O que é este arquivo.** É um guia de implementação **autossuficiente e portável** para o Claude Code construir, do zero, uma feature de **blog com postagem automática por IA** em qualquer projeto Next.js + Supabase. Toda a lógica de referência (o código-fonte real da feature, já validado em produção) está **embutida neste próprio arquivo** — você **não** precisa de acesso ao projeto de origem.
>
> **Portabilidade / escalabilidade.** Este documento é genérico. Ele **não** assume nenhum negócio específico. Em vez de receber os dados do negócio prontos, o Claude é instruído a **ler o próprio projeto onde este arquivo está** (landing page, textos institucionais, `package.json`, arquivos de conteúdo) e **extrair sozinho** o perfil do negócio (o que a empresa faz, serviços/produtos, região, tom de voz, contatos). Assim o mesmo `.md` serve para qualquer cliente: basta colocá-lo na raiz do projeto de destino e mandar o Claude executar.
>
> **Como usar (você, humano):** copie este arquivo para a raiz do projeto de destino e diga ao Claude: *"Leia o ROADMAP_AUTO_BLOG.md e execute a Fase 0."* O Claude descobre o negócio sozinho, valida com você, e segue fase a fase — parando nos pontos 🛑 que exigem uma ação sua (criar projeto Supabase, colar chaves, ligar o cron).
>
> **Como usar (você, Claude):** este documento é a fonte de verdade. Comece **sempre pela Fase 0** (descoberta do negócio) e produza o `PERFIL-DO-NEGOCIO.md`. Depois trabalhe **uma fase por vez**, na ordem. Ao terminar cada fase, rode o "Aceite" dela e atualize a seção *Status de Progresso*. Onde houver 🛑 **STOP HUMANO**, pare e peça a ação manual antes de continuar. **Nunca invente** chaves de API nem dados de negócio: os dados vêm da Fase 0 (do projeto) ou do usuário. Os blocos de código na *Biblioteca de Referência* (Parte B) são a implementação canônica — copie-os e adapte só os pontos de negócio marcados.

---

## Índice

- **Parte A — O Plano** (o que fazer, em ordem)
  - Fase 0 — Descoberta do negócio (auto-análise do projeto)
  - Serviços externos necessários
  - Visão geral das fases
  - Fases 1 a 10 (detalhadas)
  - Tabela de adaptações (pontos de acoplamento ao negócio)
  - Riscos & decisões
  - Status de progresso
- **Parte B — Biblioteca de Referência** (o código-fonte canônico embutido)
  - Como funciona o pipeline (algoritmo)
  - Modelo de dados (DDL SQL a criar)
  - Código de cada módulo (clientes, IA, automação, cron, auth, admin)

---
---

# PARTE A — O PLANO

## Fase 0 — Descoberta do negócio (auto-análise do projeto) ⭐ COMECE AQUI

**Objetivo:** o Claude descobre sozinho, lendo o projeto de destino, tudo o que a IA precisa saber sobre o negócio — para não depender de o humano digitar os dados. O produto desta fase é um arquivo **`PERFIL-DO-NEGOCIO.md`** na raiz, que alimenta todos os prompts de IA das fases seguintes.

**Tarefas:**
1. **Varra o projeto** em busca do perfil do negócio. Fontes prováveis (ler o que existir):
   - `package.json` (name/description), `README*`.
   - Textos institucionais / dados de marca: procure arquivos como `src/lib/site.*`, `src/lib/services.*`, `src/config/*`, `content/*`, `src/data/*`, ou constantes com nome/telefone/endereço.
   - Landing page e páginas institucionais: `src/app/page.*`, `src/app/(site)/**`, `app/page.*`, `pages/index.*`, páginas "quem-somos"/"sobre"/"serviços"/"contato".
   - Blog existente (para entender categorias/tom): `src/app/blog/**`, `src/lib/posts.*`, `content/**`, arquivos `.md`/`.mdx`.
   - `tailwind.config.*` / CSS de tema (paleta e fontes da marca).
2. **Extraia e registre** em `PERFIL-DO-NEGOCIO.md` os campos abaixo. Onde não encontrar, marque `⚠️ CONFIRMAR COM O USUÁRIO` (não invente):
   - **Nome da empresa** e razão social.
   - **Setor / o que faz** (1–2 frases).
   - **Produtos ou serviços** (lista — vira o catálogo do pipeline de vendas e a base do `pickService`).
   - **Segmentos / público-alvo.**
   - **Região(ões) atendida(s)** e sede (vira o seed de cidades do SEO local).
   - **Contatos de conversão** (WhatsApp/telefone/e-mail) e **como o site converte** (formulário? WhatsApp? loja?).
   - **Credenciais/certificações** relevantes (para citar sem alucinar).
   - **Tom de voz** e idioma.
   - **Domínio de produção** e **paleta/fontes** da marca (para o admin ficar consistente).
   - **Temas de conteúdo** plausíveis para o blog (derivados do setor — viram os `NEWS_TOPICS` e as categorias).
   - **Fuso horário** do público (default `America/Sao_Paulo` se for Brasil).
3. **Analise a stack atual** e registre também em `PERFIL-DO-NEGOCIO.md`:
   - Framework/versão, App Router vs Pages, TypeScript, Tailwind, alias de import.
   - Já existe Supabase? Auth? Admin? API routes? Server actions? Banco/migrations?
   - Como o blog atual é modelado e renderizado (estático vs dinâmico; formato do corpo — texto/markdown/HTML).
   - `next.config.*` tem `images.remotePatterns`? Há `vercel.json`? Plano Vercel conhecido?
4. **🛑 STOP HUMANO — validação:** apresente ao usuário um resumo do `PERFIL-DO-NEGOCIO.md` (principalmente serviços, região/cidades, contatos e tom de voz) e peça confirmação/correção dos campos marcados `⚠️ CONFIRMAR`. **Só avance para a Fase 1 após o usuário validar.**

**Aceite:** existe um `PERFIL-DO-NEGOCIO.md` completo, validado pelo usuário, sem campos `⚠️ CONFIRMAR` pendentes nos itens críticos (serviços, região/cidades, contatos, tom de voz, temas de conteúdo).

> A partir daqui, **todo lugar** no plano que disser "usar os dados do `PERFIL-DO-NEGOCIO.md`" se refere a este arquivo. Ele é o que torna o roadmap portável.

---

## Serviços externos necessários (contas a criar) — 🛑 STOP HUMANO

Antes da Fase 1, o usuário providencia as contas abaixo. Todas têm plano gratuito viável para começar. Só as marcadas **Sim** são estritamente necessárias para o mínimo funcional; o resto tem fallback (degradação graciosa).

| Serviço | Para quê | Env var(s) | Obrigatório? |
|---|---|---|---|
| **Supabase** (projeto novo) | Postgres + Auth + Storage | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | **Sim** |
| **Google AI Studio** (key) | Geração de texto (Gemini/Gemma) | `GOOGLE_AI_API_KEY` | **Sim** |
| Google AI Studio (2ª key) | Curadoria / dividir cota | `GOOGLE_AI_API_KEY_SEARCH` | Não |
| **Groq** | Llama 70B p/ conteúdo denso | `GROQ_API_KEY` | Não |
| **HuggingFace** (token) | Imagem de capa (FLUX) | `HF_TOKEN` | Não |
| **NewsAPI** | Suplemento de notícias além do RSS | `NEWS_API_KEY` | Não |
| **Unsplash** | 3º fallback de imagem | `UNSPLASH_ACCESS_KEY` | Não |
| **CRON_SECRET** (você inventa) | Proteger o endpoint de cron | `CRON_SECRET` | **Sim** (produção) |
| **AI_BOT_PROFILE_ID** | UUID do perfil autor dos posts bot | `AI_BOT_PROFILE_ID` | **Sim** (gerado na Fase 4) |

**Estritamente obrigatórios para o cron rodar:** `GOOGLE_AI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (+ URL e anon), `AI_BOT_PROFILE_ID`, `CRON_SECRET` e a linha singleton `automation_settings`. Todo o resto degrada com fallback.

---

## Visão geral das fases

| Fase | Título | Depende de | Entrega |
|---|---|---|---|
| 0 | Descoberta do negócio | — | `PERFIL-DO-NEGOCIO.md` validado |
| 1 | Infra Supabase + clientes + env | 0 | Supabase conectado, 3 clientes, `.env.local` |
| 2 | Schema do banco (migrations SQL) | 1 | Tabelas, enums, RLS, bucket, seeds |
| 3 | Blog dinâmico (migrar do estático) | 2 | Blog lê do banco; posts antigos migrados |
| 4 | Auth + área de membros + admin base | 2 | Login, middleware, roles, layout admin, bot profile |
| 5 | Camada de IA (geradores + fontes) | 2, 0 | content-generator, news-curation, imagem, closing |
| 6 | Pipeline de automação (cron-runner) | 4, 5 | runAutomation, news + sales pipelines |
| 7 | Endpoint de cron + agendamento | 6 | /api/cron/auto-publish + vercel.json |
| 8 | Painel admin de configuração | 4, 6 | Tela de settings da automação |
| 9 | Fluxo manual + polimento (opcional) | 6, 8 | Geração sob demanda, logs, revisão |
| 10 | Deploy, seeds de produção, go-live | todas | Feature no ar, cron ativo |

**Ordem:** 0 → 1 → 2 → 3 → 4 (fundação) → 5 → 6 (coração) → 7 → 8 → (9 opcional) → 10. Não pule a fundação para "ir direto na IA": a automação escreve no banco e usa `AI_BOT_PROFILE_ID`, então exige as Fases 2 e 4 prontas.

---

## Fase 1 — Infra Supabase + clientes + variáveis de ambiente

**🛑 STOP HUMANO:** usuário cria um projeto novo no Supabase e fornece `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

**Tarefas:**
1. Instalar: `@supabase/supabase-js` `@supabase/ssr`.
2. Criar `.env.local` (e um `.env.example` versionado só com os **nomes** das variáveis) com todas as env vars da tabela de serviços.
3. Criar os três clientes — **copiar de [B-1]**, ajustando só o caminho/nome do tipo `Database`:
   - `src/lib/db/supabase-client.ts` — browser (anon).
   - `src/lib/db/supabase-server.ts` — SSR por cookie (anon; httpOnly/lax/secure em prod). Respeita RLS.
   - `src/lib/db/supabase-admin.ts` — service-role. **Bypassa RLS.** Nunca importar em código client.
4. Atualizar `next.config.*`: adicionar `images.remotePatterns` para `*.supabase.co` e `images.unsplash.com`.

**Aceite:** cada cliente instancia sem erro; um `select` trivial no admin client responde (erro esperado é "tabela não existe", não "credenciais inválidas").

---

## Fase 2 — Schema do banco (migrations SQL)

> O projeto de origem **não** versionava SQL. Aqui **vamos versionar**: crie os arquivos em `supabase/migrations/` para o repo ter a fonte de verdade. **O DDL completo e comentado está em [B-2].** Copie-o.

**🛑 STOP HUMANO:** usuário roda as migrations no SQL Editor do Supabase (ou via CLI) e cria o **bucket público `cover-images`** no Storage.

**Tarefas:**
1. Criar as migrations SQL de **[B-2]**: enums (`user_role`, `post_status`), tabelas (`profiles`, `categories`, `posts`, `automation_settings`, `automation_daily_runs`, `automation_city_history`, `ai_automation_logs`), índices, **RLS** e o **trigger** que cria `profiles` on signup.
2. **Seeds** (adaptados via `PERFIL-DO-NEGOCIO.md`):
   - `categories` principais (temas do setor).
   - `automation_city_history`: **cidades da(s) região(ões) atendida(s)** — sem isso o pipeline de vendas não roda.
   - `automation_settings`: inserir **uma** linha (defaults: `is_enabled=false`, horários sensatos) — o cron lê com `.maybeSingle()` e falha sem ela.
3. Gerar os tipos TypeScript em `src/lib/db/schema.ts` (via `supabase gen types` ou à mão no padrão de **[B-2.1]**).
4. Bucket público `cover-images` no Storage.

**Aceite:** todas as tabelas existem; RLS ativo; `select` anônimo em `posts` só retorna `published`; a linha `automation_settings` existe; `automation_city_history` tem cidades; bucket `cover-images` público.

---

## Fase 3 — Blog dinâmico (migrar do estático)

**Objetivo:** o blog passa a ler do Supabase, preservando o visual atual.

**Tarefas:**
1. Refatorar a camada de dados do blog (ex.: `src/lib/posts.*`) para funções que consultam o banco:
   - `getPublishedPosts({ page, pageSize })` — `status='published'`, join `categories`, `published_at desc`, paginação. **Excluir a categoria oculta de vendas** (análogo ao `HIDDEN_SLUGS=['google']` — ver [B-3]) para artigos SEO ficarem indexáveis mas fora da lista.
   - `getPostBySlug(slug)` e `getRelatedPosts(post)`.
2. **Corpo como HTML:** o modelo novo usa `content` HTML (a IA gera HTML). Se o blog atual renderiza `body: string[]` ou markdown, trocar por um componente que injeta HTML **sanitizado** (`dangerouslySetInnerHTML` + strip de `<script>`).
3. Atualizar listagem e página `[slug]` para consumir as funções acima; manter hero/grid/"Leia também".
4. **SEO:** `generateMetadata` de `seo_title`/`seo_description`/`cover_image` (fallback `title`/`excerpt`). Mostrar "Fonte original" quando houver `source_url`. Legenda "Imagem conceitual gerada por IA" sob capas geradas.
5. **ISR/dinâmico:** conteúdo muda sem novo deploy → usar dados dinâmicos + `revalidatePath('/blog')` após publicar (ou ISR). Evitar SSG puro nas rotas do blog.
6. **Migrar os posts existentes** para a tabela `posts` (status `published`), convertendo o corpo para HTML, para o blog não ficar vazio.

**Aceite:** o blog renderiza como antes, lendo do banco; posts antigos aparecem; um post novo `published` inserido à mão aparece sem rebuild; `draft`/`scheduled` **não** aparecem.

---

## Fase 4 — Autenticação + área de membros + admin base

**Objetivo:** criar login, proteção de rotas e o esqueleto do admin (nada disso costuma existir num site institucional cru).

**Tarefas:**
1. Grupo de rotas `src/app/(admin)/admin/...` com `layout.tsx` de admin (usar paleta da marca do `PERFIL-DO-NEGOCIO.md`).
2. **Login** `src/app/(admin)/admin/login/` + server action `loginAction` em `src/server/auth.actions.ts` — **copiar de [B-5]**: valida (Zod), rate-limit in-memory (5/15min por e-mail), `signInWithPassword`, checa `profiles.role` (só `admin`/`editor` passam), redireciona; `logoutAction` limpa cookies `sb-*`.
3. **Middleware `src/middleware.ts`** — **copiar de [B-4]**: `getUser()` (não `getSession`), protege `/admin/*` exceto `/admin/login`. Ajustar as rotas de redirect ao destino (ex.: `/admin` → dashboard/posts).
4. Helper `requireAdmin()` reutilizável (usado na Fase 8) — ver o padrão em [B-6.2].
5. Trigger `on auth.users insert` que cria `profiles` (está no DDL [B-2]).
6. **🛑 STOP HUMANO — criar usuários:**
   - Criar o **usuário admin** no Supabase Auth e setar `profiles.role='admin'`.
   - Criar o **perfil do bot**: linha em `profiles` com `role='ai_bot'` (ex.: "Redação <Empresa>"). Copiar o `id` para `AI_BOT_PROFILE_ID` no `.env.local`.

**Aceite:** `/admin` sem login redireciona para `/admin/login`; login do admin entra; credenciais erradas dão erro genérico; `AI_BOT_PROFILE_ID` aponta para um `profiles.id` válido.

---

## Fase 5 — Camada de IA (geradores + fontes de conteúdo)

**Objetivo:** portar os módulos de IA — **copiar de [B-6]** — adaptando **apenas** os pontos de negócio (prompts, fontes, catálogo) via `PERFIL-DO-NEGOCIO.md`.

**🛑 STOP HUMANO:** garantir `GOOGLE_AI_API_KEY` (obrigatória) e, se possível, `GROQ_API_KEY`, `HF_TOKEN`, `NEWS_API_KEY`, `UNSPLASH_ACCESS_KEY`.

**Tarefas / módulos (copiar de [B-6] e adaptar):**
1. Deps: `@google/generative-ai`, `groq-sdk`, `@gradio/client`, `rss-parser`, `zod`.
2. `src/lib/ai/google-ai-client.ts` — [B-6.1]. **Verificar disponibilidade dos nomes de modelo** nas suas keys (alguns são "preview" e podem exigir troca de versão).
3. `src/lib/ai/rss-fetcher.ts` — [B-6.3]. Trocar o User-Agent do bot.
4. `src/lib/ai/news-curation.ts` — [B-6.4]. **Adaptar** feeds RSS, domínios NewsAPI, keywords de categoria/scoring e expansão bilíngue ao setor (ver *Adaptações* #3–#4).
5. `src/lib/ai/content-generator.ts` — [B-6.5]. **Adaptar** o `SYSTEM_PROMPT` ao domínio do negócio (ver #5). Renomear o import do "closing" (#7).
6. `src/lib/ai/sales-post-generator.ts` — [B-6.6]. **Substituir TODOS** os dados da empresa no `SYSTEM_PROMPT` pelos do `PERFIL-DO-NEGOCIO.md` (#6).
7. `src/lib/ai/<empresa>-closing.ts` — [B-6.7]. Reescrever categorias/URLs (linkar para as páginas de serviço do site), CTA e `BASE_URL` (#7).
8. `src/lib/utils/hf-image.ts` [B-6.8] + `src/lib/utils/image-providers.ts` [B-6.9]. Adicionar um `public/images/default-cover.webp` de marca.
9. `src/lib/automation/<empresa>-services.ts` — [B-6.10]: lista de serviços/produtos + `pickService(date, slot)` determinístico (#1).

**Aceite:** `generatePostContent` com um título fake retorna HTML pt-BR válido; `fetchNewsByTopic('<tema do setor>')` retorna artigos reais; `generateCoverImage` retorna uma URL (mesmo que fallback default).

---

## Fase 6 — Pipeline de automação (cron-runner)

**Objetivo:** o coração da feature. **Copiar de [B-7]** — lógica idêntica; só dados mudam.

**Módulos:**
1. `src/lib/automation/publish-scheduler.ts` — [B-7.1]: publica `scheduled` vencidos.
2. `src/lib/automation/cron-runner.ts` — [B-7.2]: `runAutomation()` com guardas de horário/timezone (`Intl` no fuso do negócio), idempotência (`automation_daily_runs`), sistema de slots (slot 0 = `published`, demais = `scheduled`), `runNewsPipeline` (rotação de tópicos + dedup por `source_url` + imagem persistida no Storage) e `runSalesPipeline` (rotação cidade × serviço, sem imagem). **Adaptar** `NEWS_TOPICS`/`TOPIC_CATEGORY` (#2), o slug da categoria oculta (#8) e o import do catálogo de serviços (#1).

**Aceite (crítico):** rodar `runAutomation()` manualmente com `is_enabled=true` e metas pequenas (1 news + 1 sales) cria os posts, publica o slot 0, agenda o resto, grava logs, e uma 2ª execução no mesmo dia **não duplica** (idempotência + dedup por `source_url`).

---

## Fase 7 — Endpoint de cron + agendamento

**Tarefas:**
1. `src/app/api/cron/auto-publish/route.ts` — **copiar de [B-8]**: `GET`, `runtime='nodejs'`, `maxDuration=300`, valida `Authorization: Bearer <CRON_SECRET>`, chama `runAutomation()`.
2. `vercel.json` — adicionar `crons` horário: `{ "path": "/api/cron/auto-publish", "schedule": "0 * * * *" }`.
   - ⚠️ `maxDuration=300` (5 min) exige **Vercel Pro**. Se for Hobby: usar agendador externo (cron-job.org / GitHub Actions / Supabase `pg_cron`) chamando o endpoint com o Bearer, ou reduzir o trabalho por execução.
3. **🛑 STOP HUMANO:** definir `CRON_SECRET` nas env vars da Vercel (e local); confirmar plano Vercel vs `maxDuration`; configurar agendador externo se necessário.

**Aceite:** `GET /api/cron/auto-publish` sem Bearer → 401/500; com Bearer → executa e retorna JSON; o agendamento dispara de hora em hora (verificável em `ai_automation_logs`).

---

## Fase 8 — Painel admin de configuração

**Tarefas:**
1. `src/app/(admin)/admin/automation/settings/page.tsx` — **copiar de [B-9.1]**: server component protegido por role admin; carrega `automation_settings`.
2. `src/components/admin/automation-settings-form.tsx` — **copiar de [B-9.2]**: form (client) com ativar/desativar, hora/minuto de início, dias ativos, nº de posts de notícias/vendas por dia, intervalo, **preview dos horários dos slots**. Ajustar componentes de UI ao design system do destino (ou usar inputs simples).
3. `src/server/automation.actions.ts` — **copiar de [B-9.3]**: `getAutomationSettings` / `saveAutomationSettingsAction` (revalida role admin, valida — inclusive "último slot não passa da meia-noite" —, grava na linha singleton).
4. Link no menu do admin.

**Aceite:** admin muda horário e nº de posts, salva, e o cron passa a respeitar; não-admin não acessa.

---

## Fase 9 — Fluxo manual + polimento (opcional)

**Tarefas (se desejado):**
1. `src/server/ai-publish.actions.ts` — versão manual do pipeline (server actions `fetchNews`/`generatePost`/`generateSalesPost`, rate-limit por usuário, geração sob demanda para revisar antes de publicar — `status='draft'`/`review_required`).
2. Página de logs no admin listando `ai_automation_logs`.
3. Ações em lote nos posts (publicar/despublicar/excluir), paginação.
4. Autoria "Redação <Empresa>", legenda de imagem IA, tratamento de erros amigável.

**Aceite:** admin gera um post manualmente e revisa como rascunho antes de publicar; logs visíveis.

---

## Fase 10 — Deploy, seeds de produção e go-live

**Checklist (🛑 vários STOP HUMANO):**
1. Env vars na Vercel (produção): Supabase (3), `GOOGLE_AI_API_KEY`, `CRON_SECRET`, `AI_BOT_PROFILE_ID` + opcionais.
2. Migrations aplicadas em produção; bucket `cover-images` público.
3. Seeds de produção: `automation_settings` (singleton, começar `is_enabled=false`), `automation_city_history` (cidades reais), categorias.
4. Usuário admin criado; profile do bot criado e `AI_BOT_PROFILE_ID` batendo.
5. `vercel.json` com o cron (ou agendador externo ativo).
6. **Teste de fumaça:** chamar o endpoint com o Bearer, metas pequenas, confirmar 1 publicado + 1 agendado, checar no blog.
7. **Ligar:** `is_enabled=true` no admin, metas conservadoras (1–2/dia) e subir.
8. Monitorar `ai_automation_logs` e a qualidade nos primeiros dias; ajustar prompts/fontes.

**Aceite:** posts nascem sozinhos no horário, aparecem no blog, com qualidade e sem duplicações; o admin controla tudo.

---

## Tabela de adaptações (pontos de acoplamento ao negócio)

> Cada linha é um lugar onde o código de referência tem um valor específico de negócio. Substitua usando o `PERFIL-DO-NEGOCIO.md`. Os `#` são referenciados nas fases acima.

| # | Ponto | Onde no código de referência | Adaptar para |
|---|---|---|---|
| 1 | **Catálogo p/ vendas** + `pickService` | [B-6.10] (`<empresa>-services.ts`) | Serviços/produtos do negócio (do PERFIL) |
| 2 | **Temas de notícia** `NEWS_TOPICS`/`TOPIC_CATEGORY` | [B-7.2] (topo do cron-runner) | Temas do setor + slugs/nomes de categoria |
| 3 | **Feeds RSS + domínios NewsAPI** | [B-6.4] `RSS_BY_CATEGORY`, `NEWSAPI_DOMAINS` | Fontes do setor (validar ao vivo) |
| 4 | **Keywords de scoring / categoria / expansão bilíngue** | [B-6.4] `CATEGORY_KEYWORDS`, `POSITIVE/NEGATIVE`, `BILINGUAL_EXPANSION`, `TIER*` | Vocabulário do nicho |
| 5 | **Prompt de conteúdo** (`SYSTEM_PROMPT`) | [B-6.5] | Domínio/tom do negócio (pt-BR) |
| 6 | **Prompt de vendas + dados da empresa** | [B-6.6] `SYSTEM_PROMPT` | TODOS os dados reais (nome, contatos, CTA…) |
| 7 | **Fechamento SEO** (categorias, URLs, `BASE_URL`, templates) | [B-6.7] | Páginas de serviço do site + CTA do negócio |
| 8 | **Categoria oculta de vendas** (`google`) | [B-7.2] `runSalesPipeline`; [B-3] `HIDDEN_SLUGS` | Manter conceito; renomear se quiser |
| 9 | **Rotação de cidades** (seed + região prioritária) | [B-2] seed; [B-7.2] `getNextCity` (`region='Sudeste'`) | Cidades/região do mercado atendido |
| 10 | **Autoria / legenda de imagem** | página `[slug]` do blog | "Redação <Empresa>" |
| 11 | **User-Agent do bot RSS** | [B-6.3] (`EmbrasBot`) | `<Empresa>Bot` |
| 12 | **Timezone** | [B-7.2] `getBrasiliaInfo` (`America/Sao_Paulo`, `-03:00`) | Fuso do público (manter se Brasil) |
| 13 | **Marca do admin** | layout/estilos do admin | Paleta/fontes do PERFIL |
| 14 | **Modelo de post** | [B-2] tabela `posts` | Expandir o `Post` atual → HTML + status + SEO + `source_url` |

---

## Riscos & decisões (revisar com o humano)

1. **Plano Vercel vs `maxDuration=300`** — decidir agendador antes da Fase 7.
2. **Disponibilidade dos modelos de IA** — nomes "preview" podem não existir na sua key; validar/trocar na Fase 5.
3. **Setor sensível (saúde/jurídico/finanças)** — reforçar regras anti-alucinação; considerar `status='review_required'` (revisão humana) nos primeiros dias.
4. **Volume** — começar 1–2 posts/dia para não poluir o blog nem estourar cotas.
5. **Fontes RSS reais** — precisam ser descobertas/testadas ao vivo para o nicho; reservar tempo na Fase 5.
6. **Custos** — cotas gratuitas têm limites; `ai_automation_logs` ajuda a auditar.

---

## Status de Progresso (Claude: mantenha atualizado)

- [x] Fase 0 — Descoberta do negócio (`PERFIL-DO-NEGOCIO.md`) ✅ validado 2026-07-06 (cidades RMSP OK; Vercel=Hobby → agendador externo na Fase 7; e-mail/endereço/redes pendentes)
- [x] Fase 1 — Infra Supabase + clientes + env ✅ Aceite OK 2026-07-06 (service_role autentica; `posts` inexistente = esperado). ⚠️ `GOOGLE_AI_API_KEY` ainda placeholder — só necessária a partir da Fase 5.
- [x] Fase 2 — Schema do banco (migrations SQL) ✅ Aceite OK 2026-07-06: 7 tabelas + RLS; 5 categorias + oculta `google`; 12 cidades RMSP; singleton `automation_settings` (is_enabled=false); bucket público `cover-images`.
- [x] Fase 3 — Blog dinâmico ✅ 2026-07-06: `posts.ts` reescrito p/ ler do Supabase (getPublishedPosts/getPostBySlug/getRelatedPosts, HIDDEN_SLUGS=['google']); `PostContent` (HTML sanitizado); `/blog`, `/blog/[slug]` e home `force-dynamic`; SEO via seo_*/cover_image; "Fonte original" + legenda "imagem conceitual por IA"; `.prose` no globals.css. Aceite validado com dados temporários (post published aparece sem rebuild; draft→404; oculto fora da lista mas 200 por URL) e depois limpos. **DESVIO: migração dos 3 posts antigos adiada p/ Fase 4** (posts.author_id é FK NOT NULL p/ profiles; usar o profile do bot criado na Fase 4).
- [ ] Fase 4 — Auth + admin base
- [ ] Fase 5 — Camada de IA
- [ ] Fase 6 — Pipeline de automação (cron-runner)
- [ ] Fase 7 — Endpoint de cron + agendamento
- [ ] Fase 8 — Painel admin de configuração
- [ ] Fase 9 — Fluxo manual + polimento (opcional)
- [ ] Fase 10 — Deploy + go-live

> Ao concluir cada fase: marque, rode o "Aceite", e anote desvios (modelo de IA trocado, fonte RSS escolhida, decisão de plano Vercel, etc.).

---
---

# PARTE B — BIBLIOTECA DE REFERÊNCIA (código canônico embutido)

> Estes são os arquivos-fonte reais da feature em produção. Copie-os para o projeto de destino e adapte **apenas** os pontos marcados na *Tabela de adaptações*. Preserve o comportamento; traduza só a saída visível ao usuário. Nos nomes de arquivo, `<empresa>` = slug do negócio (ex.: `sane`, `embras`).

## Como funciona o pipeline (algoritmo, em uma tela)

```
Cron horário -> GET /api/cron/auto-publish  (Authorization: Bearer CRON_SECRET)
  -> runAutomation():
     0. publishScheduledPosts()  — promove 'scheduled' vencidos -> 'published'
     1. carrega automation_settings (.maybeSingle); se !is_enabled -> skip
     2. guarda de horario no fuso do negocio (Intl):
          - dia nao esta em active_days -> skip
          - hora < cron_start_hour -> skip (too_early)
     3. getOrCreateDailyRun(date, 'news'|'sales', target)  — idempotencia
          - se ambas completed -> skip (daily_goal_already_met)
     4. runNewsPipeline (para slots incompletos):
          - topico = NEWS_TOPICS[slot % N], com fallback aos outros
          - fetchNewsByTopic -> filtra por source_url nao visto (dedup)
          - generatePostContent (cascata de modelos) -> generateCoverImage
          - se imagem FLUX/imagen4 -> persistImageToStorage (bucket cover-images)
          - slot 0 = published@cron_start_hour ; slot N = scheduled@(start+N*interval)
          - INSERT posts + INSERT ai_automation_logs ; updateDailyRun
     5. runSalesPipeline:
          - getNextCity (regiao prioritaria, menos usada) x pickService(date,slot)
          - generateSalesPostContent (sem imagem) -> INSERT (categoria oculta)
          - markCityUsed ; log ; updateDailyRun
```

Idempotencia: rodar de hora em hora nao duplica — `automation_daily_runs` conta o progresso por (data, tipo); slots ja feitos sao pulados; posts agendados sao publicados quando `published_at` vence.

---

## [B-1] Clientes Supabase

### `src/lib/db/supabase-admin.ts` — service-role (bypassa RLS; so server)
```ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './schema'

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY')
}

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
```

### `src/lib/db/supabase-server.ts` — SSR por cookie (respeita RLS)
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './schema'

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
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
            // setAll chamado de um Server Component — seguro ignorar (middleware renova a sessao)
          }
        },
      },
    }
  )
}
```

### `src/lib/db/supabase-client.ts` — browser (so Client Components)
```ts
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './schema'

export const createSupabaseBrowserClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

---

## [B-2] Modelo de dados (DDL SQL a criar)

> Escreva como migrations em `supabase/migrations/`. Tipos: `id` uuid `gen_random_uuid()`, timestamps `timestamptz`. Adapte apenas os **seeds** (categorias, cidades) ao negocio. Nota: os blocos `$$...$$` sao delimitadores de corpo de funcao do Postgres — cole como estao no SQL Editor.

```sql
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

-- Trigger: cria profile automaticamente quando um auth.user e criado
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
  source_url text,                      -- dedup de noticias
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_status_published_idx on posts (status, published_at desc);
create index posts_source_url_idx on posts (source_url);

-- ==== automation_settings (linha unica / singleton) ====
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

-- ==== automation_daily_runs (idempotencia) ====
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

-- ==== automation_city_history (rotacao de cidades) ====
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

-- Leitura publica so de conteudo publicado
create policy "public reads published posts" on posts
  for select using (status = 'published');
create policy "public reads categories" on categories
  for select using (true);

-- profiles: dono le/edita o proprio
create policy "own profile read" on profiles
  for select using (auth.uid() = id);
create policy "own profile update" on profiles
  for update using (auth.uid() = id);

-- Tabelas de automacao: nenhuma policy anonima (so service-role, que ignora RLS).
-- (O cron usa o admin client / service-role e bypassa todas as policies acima.)

-- ==== Seeds (ADAPTAR ao negocio via PERFIL-DO-NEGOCIO.md) ====
-- Categorias principais (temas do setor):
-- insert into categories (name, slug, description) values
--   ('<Tema 1>', '<tema-1>', '...'), ('<Tema 2>', '<tema-2>', '...');

-- Categoria oculta de vendas (nao exibida no blog):
insert into categories (name, slug, description)
  values ('Google', 'google', 'Artigos de vendas para SEO — nao exibidos no blog');

-- Linha singleton de settings:
insert into automation_settings (cron_start_hour, active_days, news_posts_per_day, sales_posts_per_day)
  values (8, '{1,2,3,4,5}', 1, 1);

-- Cidades da regiao atendida (ADAPTAR):
-- insert into automation_city_history (city, state, state_code, region) values
--   ('Sao Paulo', 'Sao Paulo', 'SP', 'Sudeste'),
--   ('Guarulhos',  'Sao Paulo', 'SP', 'Sudeste');
```

### [B-2.1] Tipos TypeScript (`src/lib/db/schema.ts`) — trecho essencial
> Gere o resto via `supabase gen types typescript`, ou espelhe a mao. O tipo `Database` e usado pelos clientes genericos. As linhas abaixo sao as que a feature consome diretamente.
```ts
export type UserRole = 'admin' | 'editor' | 'ai_bot'
export type PostStatus = 'draft' | 'published' | 'scheduled' | 'ai_generating' | 'review_required'

export type Profile = { id: string; full_name: string; avatar_url: string | null; role: UserRole; bio: string | null; created_at: string; updated_at: string }
export type Category = { id: string; name: string; slug: string; description: string | null; created_at: string }
export type Post = {
  id: string; title: string; slug: string; content: string; excerpt: string | null; cover_image: string | null
  author_id: string; category_id: string; status: PostStatus
  seo_title: string | null; seo_description: string | null; seo_keywords: string[] | null
  image_prompt: string | null; source_url: string | null; published_at: string | null; created_at: string; updated_at: string
}
export type AutomationSettings = {
  id: string; cron_start_hour: number; cron_start_minute: number; active_days: number[]
  news_posts_per_day: number; sales_posts_per_day: number; post_interval_hours: number; is_enabled: boolean; updated_at: string
}
export type AutomationDailyRun = { id: string; run_date: string; run_type: 'news' | 'sales'; posts_created: number; posts_target: number; completed: boolean; last_attempt_at: string | null; created_at: string }
export type AutomationCityHistory = { id: string; city: string; state: string; state_code: string; region: string; last_used_date: string | null; usage_count: number }
export type AiAutomationLog = { id: string; post_id: string | null; prompt_used: string; model_version: string; token_usage: number | null; raw_response: Record<string, unknown> | null; generation_date: string }

// Database: gere via `supabase gen types` OU declare um tipo com estas tabelas
// para tipar createClient<Database>. Se preferir simplicidade inicial, use `any`.
```

---

## [B-3] Blog dinamico — pontos-chave

- **Categoria oculta de vendas:** na listagem do blog, excluir os posts cuja categoria esteja em `HIDDEN_SLUGS = ['google']` (assim os artigos SEO ficam indexaveis por URL, mas fora da lista do blog).
- **Corpo HTML:** renderizar `post.content` com `dangerouslySetInnerHTML`, apos strip de `<script>`. Ex. de componente:
```tsx
export function PostContent({ html }: { html: string }) {
  const safe = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  return <div className="prose" dangerouslySetInnerHTML={{ __html: safe }} />
}
```
- **Queries** (via `supabase-server` ou `supabase-admin` conforme o contexto): `status='published'`, join `categories`, ordenar por `published_at desc`, paginar; para `[slug]`: filtrar `status='published'` + `slug`.
- **SEO:** `generateMetadata` a partir de `seo_title`/`seo_description`/`cover_image`.
- **Revalidacao:** apos publicar (no cron ou manual), chamar `revalidatePath('/blog')` e `revalidatePath('/blog/[slug]')`.

---

## [B-4] Middleware de protecao (`src/middleware.ts`)

> Ajuste as rotas de redirect ao destino (ex.: `/admin` -> `/admin/posts` ou `/admin/dashboard`).
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export const middleware = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              sameSite: 'lax',
              secure: process.env.NODE_ENV === 'production',
            })
          )
        },
      },
    }
  )

  // IMPORTANTE: nunca chamar getSession() aqui. getUser() valida o token no servidor Auth.
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isLoginPage = pathname === '/admin/login'

  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  if (pathname === '/admin' || pathname === '/admin/') {
    const target = user ? '/admin/posts' : '/admin/login'
    return NextResponse.redirect(new URL(target, request.url))
  }
  if (!user && !isLoginPage && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return supabaseResponse
}

export const config = { matcher: ['/admin/:path*'] }
```

---

## [B-5] Auth server actions (`src/server/auth.actions.ts`)

```ts
'use server'

import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { z } from 'zod'

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) })
type LoginResult = { error: string }

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
function resetLoginAttempts(email: string): void { loginAttempts.delete(email.toLowerCase()) }

export const loginAction = async (formData: FormData): Promise<LoginResult> => {
  const parsed = loginSchema.safeParse({ email: formData.get('email'), password: formData.get('password') })
  const INVALID = { error: 'Credenciais invalidas.' }   // erro generico — evita enumeracao de usuarios
  if (!parsed.success) return INVALID
  if (isLoginRateLimited(parsed.data.email)) return { error: 'Muitas tentativas. Tente novamente em 15 minutos.' }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email: parsed.data.email, password: parsed.data.password })
  if (error || !data.user) return INVALID

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
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
    if (cookie.name.includes('sb-') || cookie.name.includes('supabase')) cookieStore.delete(cookie.name)
  }
  redirect('/admin/login')
}
```
> O `LoginForm` é um Client Component com `react-hook-form` + `zod` que chama `loginAction`. Um form HTML simples com `action={loginAction}` também funciona.

---

## [B-6] Camada de IA

### [B-6.1] `src/lib/ai/google-ai-client.ts` — singletons dos modelos Google
> ⚠️ ADAPTAR (#): confirme os nomes de modelo disponíveis na sua key. Os "preview" podem mudar.
```ts
import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error('GOOGLE_AI_API_KEY nao configurada')
}

// Conta 1 — escrita de conteudo + fallback de ranking
const ai1 = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)
export const gemma  = ai1.getGenerativeModel({ model: 'gemma-3-27b-it' })
export const gemma4 = ai1.getGenerativeModel({ model: 'gemma-4-31b-it' })
export const gemini = ai1.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' })

// Conta 2 — curadoria (null quando a key nao esta setada = degradacao graciosa)
const ai2 = process.env.GOOGLE_AI_API_KEY_SEARCH
  ? new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY_SEARCH)
  : null

export type CurationModel = { label: string; model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> }
export const curationModels: CurationModel[] = ai2
  ? [
      { label: 'Gemma 4 31B',      model: ai2.getGenerativeModel({ model: 'gemma-4-31b-it' }) },
      { label: 'Gemini Flash Lite', model: ai2.getGenerativeModel({ model: 'gemini-3.1-flash-lite-preview' }) },
      { label: 'Gemma 4 26B (MoE)', model: ai2.getGenerativeModel({ model: 'gemma-4-26b-a4b-it' }) },
    ]
  : []
export const geminiSearch = ai2 ? ai2.getGenerativeModel({ model: 'gemini-2.0-flash' }) : null
```

### [B-6.3] `src/lib/ai/rss-fetcher.ts` — fetch de feeds RSS/Atom
> ⚠️ ADAPTAR (#11): trocar o User-Agent `EmbrasBot` por `<Empresa>Bot`.
```ts
import Parser from 'rss-parser'
import type { NewsArticle } from './news-curation'

const FEED_TIMEOUT_MS = 7000   // parseURL() socket timeout e nao confiavel — controlamos via fetch
const UA = 'Mozilla/5.0 (compatible; EmbrasBot/1.0; +https://exemplo.com.br)'  // ADAPTAR

const parser = new Parser({
  headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' },
})

export async function fetchRSSFeed(url: string): Promise<NewsArticle[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), FEED_TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*' },
    })
    if (!res.ok) { console.warn(`[rss-fetcher] HTTP ${res.status} for ${url}`); return [] }
    const text = await res.text()
    const feed = await parser.parseString(text)
    const sourceName = feed.title?.trim() || new URL(url).hostname.replace(/^www\./, '')
    return (feed.items ?? []).slice(0, 20).flatMap((item) => {
      const title = item.title?.trim() ?? ''
      const link = item.link?.trim() ?? ''
      if (!title || !link) return []
      return [{
        title, url: link,
        description: item.contentSnippet?.trim() ?? item.summary?.trim() ?? '',
        source: sourceName,
        publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
      }]
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.warn(`[rss-fetcher] Failed ${url}: ${msg.slice(0, 80)}`)
    return []
  } finally { clearTimeout(timer) }
}

export async function fetchMultipleFeeds(urls: string[]): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(urls.map(fetchRSSFeed))
  return results
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value)
}
```

### [B-6.4] `src/lib/ai/news-curation.ts` — agregador RSS + NewsAPI por categoria
> ⚠️ ADAPTAR (#3, #4): TODAS as constantes de topo (`CATEGORY_KEYWORDS`, `BILINGUAL_EXPANSION`, `RSS_BY_CATEGORY`, `NEWSAPI_DOMAINS`, `TIER*`, `POSITIVE/NEGATIVE_KEYWORDS`) sao especificas do setor. Reescreva-as para o nicho do negocio. A logica (score/dedup/diversidade) fica igual.
```ts
import { fetchMultipleFeeds } from './rss-fetcher'

export type NewsArticle = {
  title: string; url: string; description: string; source: string; publishedAt: string
  density?: 'dense' | 'general'   // setado pelo curador; undefined = 'general'
}

type Category = 'lighting' | 'architecture' | 'interior' | 'trends'   // ADAPTAR: renomeie as categorias do setor

const CATEGORY_KEYWORDS: Record<Category, string[]> = {   // ADAPTAR
  lighting: ['iluminacao','led','luminaria','lighting','lamp','poste','projetor','pendente','downlight'],
  architecture: ['arquitetura','architecture','projeto','edificio','construcao','fachada','urbano','building'],
  interior: ['interior','interiores','decoracao','decor','ambientes','sala','quarto','furniture','mobiliario'],
  trends: ['tendencias','trends','trend','novidades'],
}

function detectCategory(topic: string): Category {
  const t = topic.toLowerCase()
  if (CATEGORY_KEYWORDS.lighting.some((kw) => t.includes(kw))) return 'lighting'
  if (CATEGORY_KEYWORDS.interior.some((kw) => t.includes(kw))) return 'interior'
  if (CATEGORY_KEYWORDS.architecture.some((kw) => t.includes(kw))) return 'architecture'
  if (CATEGORY_KEYWORDS.trends.some((kw) => t.includes(kw))) return 'trends'
  return 'trends'
}

// Expansao PT->EN aplicada ao `q` da NewsAPI (para feeds em ingles retornarem)  — ADAPTAR
const BILINGUAL_EXPANSION: Array<[RegExp, string[]]> = [
  [/ilumina[cc][aa]o/i, ['lighting', 'illumination']],
  [/arquitetura/i,      ['architecture', 'architectural design']],
  [/interiores?/i,      ['interior design', 'interior']],
  [/tend[ee]ncias?/i,   ['trends', 'design trends']],
]
function expandQueryBilingual(topic: string): string {
  const extras = new Set<string>()
  for (const [pattern, equivalents] of BILINGUAL_EXPANSION) if (pattern.test(topic)) equivalents.forEach((e) => extras.add(e))
  if (extras.size === 0) return topic
  return `${topic} OR ${[...extras].join(' OR ')}`
}

const RSS_BY_CATEGORY: Record<Category, string[]> = {   // ADAPTAR: fontes reais do setor (validar ao vivo!)
  lighting: ['https://www.ledinside.com/rss', 'https://www.led-professional.com/RSS'],
  architecture: ['https://www.archdaily.com/feed/', 'https://www.dezeen.com/feed/'],
  interior: ['https://www.dezeen.com/feed/', 'https://www.designboom.com/feed/'],
  trends: ['https://www.archdaily.com/feed/', 'https://www.dezeen.com/feed/'],
}
const NEWSAPI_DOMAINS: Record<Category, string | null> = {   // ADAPTAR (null = so RSS)
  lighting: null, architecture: 'archdaily.com', interior: 'dezeen.com,designboom.com', trends: 'archdaily.com,dezeen.com',
}

const TIER1_NAMES = new Set(['ledinside','archdaily','dezeen'])   // ADAPTAR: fontes premium do setor
const TIER2_NAMES = new Set(['designboom','archpaper','contemporist'])
function sourceTier(sourceName: string): 0 | 1 | 2 {
  const s = sourceName.toLowerCase()
  if ([...TIER1_NAMES].some((n) => s.includes(n))) return 1
  if ([...TIER2_NAMES].some((n) => s.includes(n))) return 2
  return 0
}

const POSITIVE_KEYWORDS = ['lighting','led lighting','luminaire','iluminacao','luminaria']   // ADAPTAR
const NEGATIVE_KEYWORDS = ['celebrity','politics','crime','crypto','football','recipe']       // ADAPTAR

function scoreArticle(article: NewsArticle, topic: string, category: Category): number {
  const text = `${article.title} ${article.description}`.toLowerCase()
  let score = 0
  const tier = sourceTier(article.source)
  if (tier === 1) score += 3; else if (tier === 2) score += 2
  if (CATEGORY_KEYWORDS[category].some((kw) => text.includes(kw))) score += 2
  const topicWords = topic.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
  for (const word of topicWords) if (text.includes(word)) score += 3
  for (const kw of POSITIVE_KEYWORDS) if (text.includes(kw)) score += 2
  for (const kw of NEGATIVE_KEYWORDS) if (text.includes(kw)) score -= 5
  return score
}
const SCORE_THRESHOLD = 1

function isJunk(a: NewsArticle): boolean { return !a.title || a.title.length < 20 || !a.url }
function normaliseTitle(t: string): string { return t.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() }
function parseDate(d: string): number { if (!d) return 0; try { return new Date(d).getTime() } catch { return 0 } }

// Filtro de diversidade: max N por fonte; ordem: data -> diversidade -> relevancia
function applyDiversityFilter(rawScored: Array<{ article: NewsArticle; score: number }>, maxPerSource = 3, targetCount = 10): NewsArticle[] {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
  const sorted = [...rawScored].sort((a, b) => {
    const da = parseDate(a.article.publishedAt), db = parseDate(b.article.publishedAt)
    if (Math.abs(db - da) > ONE_WEEK_MS) return db - da
    return b.score - a.score
  })
  const sourceCount = new Map<string, number>()
  const selected: Array<{ article: NewsArticle; score: number }> = []
  const overflow: Array<{ article: NewsArticle; score: number }> = []
  for (const item of sorted) {
    const key = item.article.source.toLowerCase()
    const count = sourceCount.get(key) ?? 0
    if (count < maxPerSource) { selected.push(item); sourceCount.set(key, count + 1) } else overflow.push(item)
    if (selected.length >= targetCount) break
  }
  if (selected.length < targetCount) {
    overflow.sort((a, b) => b.score - a.score)
    for (const item of overflow) { selected.push(item); if (selected.length >= targetCount) break }
  }
  return selected.map(({ article }) => article)
}

type RawApiArticle = { title?: string; url?: string; description?: string; content?: string; source?: { name?: string }; publishedAt?: string }
async function fetchFromNewsAPI(apiKey: string, topic: string, domains: string): Promise<NewsArticle[]> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 8000)
  try {
    const url = new URL('https://newsapi.org/v2/everything')
    url.searchParams.set('q', expandQueryBilingual(topic))
    url.searchParams.set('domains', domains)
    url.searchParams.set('sortBy', 'publishedAt')
    url.searchParams.set('pageSize', '20')
    url.searchParams.set('apiKey', apiKey)
    const res = await fetch(url.toString(), { signal: controller.signal, next: { revalidate: 300 } } as RequestInit)
    if (!res.ok) { console.warn(`[news-curation] NewsAPI ${res.status}`); return [] }
    const data = await res.json()
    return ((data.articles ?? []) as RawApiArticle[]).flatMap((a) => {
      const title = a.title?.trim() ?? '', articleUrl = a.url?.trim() ?? ''
      if (!title || !articleUrl) return []
      return [{ title, url: articleUrl, description: a.description?.trim() ?? a.content?.trim() ?? '', source: a.source?.name ?? '', publishedAt: a.publishedAt ?? '' }]
    })
  } catch (err) { console.warn('[news-curation] NewsAPI fetch failed:', err); return [] }
  finally { clearTimeout(timer) }
}

export const fetchNewsByTopic = async (topic: string): Promise<NewsArticle[]> => {
  const category = detectCategory(topic)
  const apiKey = process.env.NEWS_API_KEY
  const [rssArticles, newsapiArticles] = await Promise.all([
    fetchMultipleFeeds(RSS_BY_CATEGORY[category]),
    apiKey && NEWSAPI_DOMAINS[category] ? fetchFromNewsAPI(apiKey, topic, NEWSAPI_DOMAINS[category]!) : Promise.resolve([] as NewsArticle[]),
  ])
  const seenTitles = new Set<string>()
  const rawScored: Array<{ article: NewsArticle; score: number }> = []
  for (const article of [...rssArticles, ...newsapiArticles]) {
    if (isJunk(article)) continue
    const norm = normaliseTitle(article.title)
    if (seenTitles.has(norm)) continue
    seenTitles.add(norm)
    const score = scoreArticle(article, topic, category)
    if (score < SCORE_THRESHOLD) continue
    rawScored.push({ article, score })
  }
  return applyDiversityFilter(rawScored, 3, 10)
}
```

### [B-6.5] `src/lib/ai/content-generator.ts` — geracao de artigo (cascata de modelos)
> ⚠️ ADAPTAR (#5): o `SYSTEM_PROMPT` e o `image_prompt` mencionam o setor. Reescreva para o dominio do negocio. Renomeie o import do closing (#7).
```ts
import Groq from 'groq-sdk'
import { gemini, gemma, gemma4 } from '@/lib/ai/google-ai-client'
import { generateEmbrasClosing } from '@/lib/ai/embras-closing'   // ADAPTAR: <empresa>-closing
import { z } from 'zod'

const GeneratedPostSchema = z.object({
  title: z.string(), slug: z.string(), content: z.string(), excerpt: z.string(),
  seo_title: z.string(), seo_description: z.string(), seo_keywords: z.array(z.string()), image_prompt: z.string(),
})
export type GeneratedPost = z.infer<typeof GeneratedPostSchema> & { model_used: string }

// ADAPTAR (#5): dominio/tom do negocio
const SYSTEM_PROMPT = `You are an expert content writer specializing in <SETOR DO NEGOCIO> for the Brazilian market.
Given a reference article, write an original journalistic article in Brazilian Portuguese (pt-BR).
Return ONLY a valid JSON object — no markdown, no extra text.`

const buildUserPrompt = (article: { title: string; url: string; description: string }) => `
Write an original journalistic article in Brazilian Portuguese (pt-BR) based on this source:

Original title: ${article.title}
URL: ${article.url}
Summary: ${article.description}

Return a JSON with EXACTLY these fields (no extra fields):
{
  "title": "article title in Brazilian Portuguese (max 80 characters)",
  "slug": "title-in-kebab-case-no-accents-no-special-characters",
  "content": "full content in semantic HTML using <h2>, <h3>, <p>, <ul>/<ol> where applicable, minimum 400 words. Do NOT include <html>, <head>, <body> or <script> tags. Write in Brazilian Portuguese.",
  "excerpt": "one short sentence summary in Brazilian Portuguese (max 160 characters)",
  "seo_title": "SEO-optimized title in Brazilian Portuguese (max 60 characters)",
  "seo_description": "descriptive meta description in Brazilian Portuguese (max 160 characters)",
  "seo_keywords": ["keyword-1", "keyword-2", "keyword-3", "keyword-4"],
  "image_prompt": "English description for cover image generation — focus on <TEMA VISUAL DO SETOR>"
}
`.trim()

const stripScriptTags = (t: string): string => t.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
const parseJsonText = (raw: string): unknown => JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim())

type ModelRunner = { label: string; run: () => Promise<string> }
type Article = { title: string; url: string; description: string }

const llamaRunner = (a: Article): ModelRunner => ({
  label: 'llama-3.3-70b-versatile',
  run: async () => {
    if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY nao configurada')
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const c = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: buildUserPrompt(a) }],
      response_format: { type: 'json_object' }, temperature: 0.7,
    })
    return c.choices[0]?.message?.content ?? ''
  },
})
const geminiRunner = (a: Article): ModelRunner => ({ label: 'gemini-3.1-flash-lite', run: async () => (await gemini.generateContent({ contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(a)}` }] }] })).response.text() })
const gemmaRunner  = (a: Article): ModelRunner => ({ label: 'gemma-3-27b-it',    run: async () => (await gemma.generateContent({ contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(a)}` }] }] })).response.text() })
const gemma4Runner = (a: Article): ModelRunner => ({ label: 'gemma-4-31b-it',    run: async () => (await gemma4.generateContent({ contents: [{ role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\n${buildUserPrompt(a)}` }] }] })).response.text() })

function buildRunners(a: Article, density: 'dense' | 'general'): ModelRunner[] {
  if (density === 'dense') return [llamaRunner(a), gemmaRunner(a), gemma4Runner(a)]   // denso: Llama -> Gemma -> Gemma4
  return [geminiRunner(a), gemmaRunner(a), gemma4Runner(a)]                            // geral: Gemini -> Gemma -> Gemma4
}

const MAX_ATTEMPTS = 3
export const generatePostContent = async (article: Article & { density?: 'dense' | 'general' }): Promise<GeneratedPost> => {
  const density = article.density ?? 'general'
  const runners = buildRunners(article, density)
  let lastError: Error = new Error('Nenhuma tentativa realizada')
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const runner = runners[i % runners.length]
    try {
      const parsed = GeneratedPostSchema.safeParse(parseJsonText(await runner.run()))
      if (!parsed.success) throw new Error(`Formato invalido: ${parsed.error.issues[0]?.message}`)
      const cleanContent = stripScriptTags(parsed.data.content)
      const closing = await generateEmbrasClosing(parsed.data.title, parsed.data.excerpt, article.description)   // ADAPTAR
      return { ...parsed.data, content: `${cleanContent}\n${closing}`, excerpt: stripScriptTags(parsed.data.excerpt), title: stripScriptTags(parsed.data.title), model_used: runner.label }
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      console.warn(`[content-generator] ${runner.label} falhou (${i + 1}/${MAX_ATTEMPTS}): ${lastError.message}`)
    }
  }
  throw new Error(`Todos os modelos falharam apos ${MAX_ATTEMPTS} tentativas. Ultimo erro: ${lastError.message}`)
}
```

### [B-6.6] `src/lib/ai/sales-post-generator.ts` — artigos de venda SEO (serviço × cidade)
> ⚠️ ADAPTAR (#6): substitua TODO o bloco "DADOS REAIS DA EMPRESA" e as regras de CTA pelos dados do `PERFIL-DO-NEGOCIO.md`. A estrutura de cascata/parse fica igual.
```ts
import { gemini, gemma, gemma4 } from '@/lib/ai/google-ai-client'
import { z } from 'zod'

const SalesPostSchema = z.object({
  title: z.string(), slug: z.string(), content: z.string().min(100), excerpt: z.string(),
  seo_title: z.string(), seo_description: z.string(), seo_keywords: z.array(z.string()),
})
export type GeneratedSalesPost = z.infer<typeof SalesPostSchema> & { model_used: string }

// ADAPTAR (#6): manual de conteudo com os DADOS REAIS do negocio
const SYSTEM_PROMPT = `Voce e um redator especialista em SEO comercial para o setor de <SETOR> no mercado brasileiro.
Sua funcao e criar paginas de venda otimizadas para buscas locais do tipo "[servico] + [cidade]".
Retorne APENAS um objeto JSON valido — sem markdown, sem texto extra.

DADOS REAIS DA EMPRESA (use SOMENTE estes — nao invente nada):
- Nome: <NOME DA EMPRESA>
- Fundada: <ANO>
- Sede: <CIDADE/UF>
- Especialidade: <O QUE FAZ>
- Servicos: <LISTA DE SERVICOS>
- Telefone/WhatsApp: <CONTATOS REAIS>
- Como converte: <WhatsApp / formulario / loja>

OBJETIVO: capturar trafego organico com intencao de compra e converter em lead.

ESTRUTURA (flexivel): abertura com servico+cidade no 1o paragrafo; sobre o servico; por que a empresa; itens relacionados (4-6); contexto local; CTA.

REGRAS DE SEO: keyword principal (servico+cidade) 3-5x no total; nunca 2x no mesmo paragrafo; usar variacoes; H1 com servico+cidade natural.
REGRAS ANTI-ALUCINACAO: nao inventar estatisticas, certificacoes, premios; nao mencionar outras cidades alem da pedida; se nao souber algo da cidade, usar apenas estado/regiao.
REGRAS DE CTA (obrigatorias): incluir SEMPRE os contatos reais acima; mencionar solicitacao de orcamento; nao criar links ficticios.
FORMATO: HTML semantico (<h1>,<h2>,<p>,<ul><li>,<strong>). NAO usar classes CSS, <html>/<head>/<body>/<script>/<style>/<iframe>, nem markdown.

Retorne JSON com exatamente: title, slug (kebab-case sem acentos), content (HTML com h1+secoes+CTA), excerpt (max 160), seo_title (max 60), seo_description (max 160), seo_keywords (array).`

const buildUserPrompt = (service: string, city: string): string => `servico: ${service}\ncidade: ${city}`

const parseJSON = (raw: string): unknown => {
  const stripped = raw.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
  try { return JSON.parse(stripped) } catch {
    const m = stripped.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); throw new Error('Nenhum JSON encontrado na resposta')
  }
}

const MODELS = [{ client: gemini, name: 'gemini-flash-lite' }, { client: gemma, name: 'gemma-3-27b' }, { client: gemma4, name: 'gemma-4-31b' }]

export const generateSalesPostContent = async (service: string, city: string): Promise<GeneratedSalesPost> => {
  const userPrompt = buildUserPrompt(service, city)
  const errors: string[] = []
  for (const { client, name } of MODELS) {
    try {
      const result = await client.generateContent({ systemInstruction: SYSTEM_PROMPT, contents: [{ role: 'user', parts: [{ text: userPrompt }] }] })
      const parsed = SalesPostSchema.safeParse(parseJSON(result.response.text()))
      if (!parsed.success) { errors.push(`[${name}] schema invalido`); continue }
      return { ...parsed.data, model_used: name }
    } catch (err) { errors.push(`[${name}] ${err instanceof Error ? err.message : String(err)}`) }
  }
  throw new Error(`Todos os modelos falharam ao gerar o artigo de vendas:\n${errors.join('\n')}`)
}
```

### [B-6.7] `src/lib/ai/<empresa>-closing.ts` — parágrafo de fechamento SEO com CTA
> ⚠️ ADAPTAR (#7): `BASE_URL`, as categorias (`CategoryKey`), `CATEGORY_URLS` (linkar para `/servicos/[slug]` do site), labels, keywords de deteccao e os templates de `FALLBACKS`. A mecanica (detectar categoria -> prompt com URL fixa -> enforceUrl -> fallback) fica igual.
```ts
import { gemini, gemma } from '@/lib/ai/google-ai-client'

const BASE_URL = 'https://www.exemplo.com.br'   // ADAPTAR

type CategoryKey = 'cat-a' | 'cat-b' | 'cat-c'   // ADAPTAR: categorias/servicos do negocio
const CATEGORY_URLS: Record<CategoryKey, string> = {   // ADAPTAR: paginas de servico reais
  'cat-a': `${BASE_URL}/servicos/cat-a/`, 'cat-b': `${BASE_URL}/servicos/cat-b/`, 'cat-c': `${BASE_URL}/servicos/cat-c/`,
}
const CATEGORY_LABELS: Record<CategoryKey, string> = { 'cat-a': 'Servico A', 'cat-b': 'Servico B', 'cat-c': 'Servico C' }

// Ordem importa — primeira correspondencia vence. ADAPTAR keywords ao setor.
const DETECTION_RULES: Array<{ category: CategoryKey; keywords: string[] }> = [
  { category: 'cat-a', keywords: ['palavra1', 'palavra2'] },
  { category: 'cat-b', keywords: ['palavra3', 'palavra4'] },
  { category: 'cat-c', keywords: ['palavra5'] },
]
const FALLBACKS: Record<CategoryKey, (url: string) => string> = {   // ADAPTAR textos
  'cat-a': (url) => `<texto sobre servico A>. Conheca <a href="${url}">nossa solucao</a>.`,
  'cat-b': (url) => `<texto sobre servico B>. Conheca <a href="${url}">nossa solucao</a>.`,
  'cat-c': (url) => `<texto sobre servico C>. Conheca <a href="${url}">nossa solucao</a>.`,
}

const normalize = (t: string): string => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const detectCategory = (text: string): CategoryKey => {
  const n = normalize(text)
  for (const rule of DETECTION_RULES) if (rule.keywords.some((kw) => n.includes(normalize(kw)))) return rule.category
  return DETECTION_RULES[DETECTION_RULES.length - 1].category
}
const enforceUrl = (html: string, correctUrl: string): string => {
  if (html.includes(correctUrl)) return html
  const fixed = html.replace(/href="[^"]*"/g, `href="${correctUrl}"`)
  if (fixed !== html) return fixed
  return html.replace(/<\/p>$/, ` Conheca <a href="${correctUrl}">nossos servicos</a>.</p>`)
}
const buildPrompt = (title: string, excerpt: string, label: string, url: string): string =>
  `Voce e um redator SEO. Escreva um paragrafo de fechamento conectando o tema do artigo com a empresa.
ARTIGO — Titulo: ${title} | Resumo: ${excerpt}
DADOS (use apenas estes): categoria relevante: ${label}; URL (use exatamente esta): ${url}
REGRAS: conecte ao tema real; apresente a empresa de forma natural; insira exatamente 1 link href="${url}" com ancora descritiva; nunca "clique aqui"; max 120 palavras; max 2 mencoes ao nome; sem superlativos; nao invente dados; retorne APENAS o paragrafo em HTML.`.trim()

const tryModel = async (model: typeof gemini, prompt: string, url: string, timeoutMs = 8000): Promise<string> => {
  const result = await Promise.race([
    model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] }),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('closing timeout')), timeoutMs)),
  ])
  const cleaned = result.response.text().trim().replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/i, '').trim()
  const wrapped = cleaned.startsWith('<p') ? cleaned : `<p class="post-closing">${cleaned}</p>`
  return enforceUrl(wrapped, url)
}

// Renomeie o export para generate<Empresa>Closing e atualize o import no content-generator.
export const generateEmbrasClosing = async (title: string, excerpt: string, sourceDescription: string): Promise<string> => {
  const category = detectCategory(`${title} ${excerpt} ${sourceDescription}`)
  const url = CATEGORY_URLS[category], label = CATEGORY_LABELS[category]
  const prompt = buildPrompt(title, `${excerpt} ${sourceDescription}`.slice(0, 500), label, url)
  try { return await tryModel(gemini, prompt, url) } catch {}
  try { return await tryModel(gemma, prompt, url) } catch {}
  return `<p class="post-closing">${FALLBACKS[category](url)}</p>`
}
```

### [B-6.8] `src/lib/utils/hf-image.ts` — imagem de capa (FLUX -> backup -> Unsplash -> default)
```ts
import { Client } from '@gradio/client'
import { fetchUnsplashImage } from '@/lib/utils/image-providers'

export const DEFAULT_COVER = '/images/default-cover.webp'
export type ImageOrigin = 'flux' | 'imagen4' | 'unsplash' | 'default'
export type CoverImageResult = { url: string; origin: ImageOrigin }

const TIMEOUT_MS = 35_000, MAX_RETRIES = 3
const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> => Promise.race([p, new Promise<never>((_, r) => setTimeout(() => r(new Error('HF request timeout')), ms))])
const isRateLimitError = (err: unknown): boolean => {
  const m = (err instanceof Error ? err.message : String(err)).toLowerCase()
  return ['rate','quota','limit','exceeded','too many'].some((k) => m.includes(k))
}
const extractImageUrl = (data: unknown): string | null => {
  if (!data) return null
  const item = Array.isArray(data) ? data[0] : data
  if (typeof item === 'string' && item.startsWith('http')) return item
  if (typeof item === 'object' && item !== null) {
    const o = item as Record<string, unknown>
    if (typeof o.url === 'string') return o.url
    if (typeof o.path === 'string') return o.path
  }
  return null
}

const tryFluxPrimary = async (prompt: string): Promise<string | null> => {
  const token = process.env.HF_TOKEN as `hf_${string}` | undefined
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const client = await withTimeout(Client.connect('black-forest-labs/FLUX.2-klein-4B', { token }), TIMEOUT_MS)
      const result = await withTimeout(client.predict('/infer', {
        prompt, input_images: [], mode_choice: 'Distilled (4 steps)', seed: 0, randomize_seed: true,
        width: 1024, height: 1024, num_inference_steps: 4, guidance_scale: 3, prompt_upsampling: false,
      }), TIMEOUT_MS)
      const url = extractImageUrl(result.data); if (url) return url
    } catch (err) { if (isRateLimitError(err)) return null }
  }
  return null
}
const tryFluxBackup = async (prompt: string): Promise<string | null> => {
  const token = process.env.HF_TOKEN as `hf_${string}` | undefined
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const client = await withTimeout(Client.connect('llamameta/Fake-FLUX-Pro-Unlimited', { token }), TIMEOUT_MS)
      const result = await withTimeout(client.predict('/generate_image', { prompt, model: 'imagen-4-ultra' }), TIMEOUT_MS)
      const url = extractImageUrl(result.data); if (url) return url
    } catch (err) { if (isRateLimitError(err)) return null }
  }
  return null
}

export const generateCoverImage = async (prompt: string): Promise<CoverImageResult> => {
  const primary = await tryFluxPrimary(prompt); if (primary) return { url: primary, origin: 'flux' }
  const backup = await tryFluxBackup(prompt);   if (backup)  return { url: backup, origin: 'imagen4' }
  const unsplash = await fetchUnsplashImage(prompt); if (unsplash) return { url: unsplash, origin: 'unsplash' }
  return { url: DEFAULT_COVER, origin: 'default' }
}
```

### [B-6.9] `src/lib/utils/image-providers.ts` — Unsplash
```ts
export const fetchUnsplashImage = async (query: string): Promise<string | null> => {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY
  if (!accessKey) return null
  const url = new URL('https://api.unsplash.com/search/photos')
  url.searchParams.set('query', query); url.searchParams.set('per_page', '1')
  url.searchParams.set('orientation', 'landscape'); url.searchParams.set('content_filter', 'high')
  try {
    const res = await fetch(url.toString(), { headers: { Authorization: `Client-ID ${accessKey}` }, next: { revalidate: 3600 } })
    if (!res.ok) return null
    const data = await res.json()
    return (data.results?.[0]?.urls?.regular as string) ?? null
  } catch { return null }
}
```

### [B-6.10] `src/lib/automation/<empresa>-services.ts` — catálogo + `pickService`
> ⚠️ ADAPTAR (#1): a lista de servicos/produtos vem do `PERFIL-DO-NEGOCIO.md`.
```ts
export const SERVICES = [   // ADAPTAR: servicos/produtos do negocio
  'Servico A', 'Servico B', 'Servico C', 'Servico D',
] as const

// Selecao deterministica por data + slot (variedade entre dias e dentro do dia)
export function pickService(dateStr: string, slot: number): string {
  const seed = parseInt(dateStr.replace(/-/g, ''), 10)
  const idx = (seed + slot * 7) % SERVICES.length
  return SERVICES[idx]
}
```

---

## [B-7] Pipeline de automação

### [B-7.1] `src/lib/automation/publish-scheduler.ts`
```ts
import { supabaseAdmin } from '@/lib/db/supabase-admin'

// Promove posts 'scheduled' cujo published_at ja passou -> 'published'. Seguro em qualquer contexto server.
export async function publishScheduledPosts(): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('posts').update({ status: 'published' })
    .eq('status', 'scheduled').lte('published_at', new Date().toISOString()).select('id')
  if (error) { console.error('[publishScheduledPosts] error:', error.message); return 0 }
  const count = data?.length ?? 0
  if (count > 0) console.info(`[publishScheduledPosts] published ${count} scheduled post(s)`)
  return count
}
```

### [B-7.2] `src/lib/automation/cron-runner.ts` — orquestrador
> ⚠️ ADAPTAR: `NEWS_TOPICS` / `TOPIC_CATEGORY` (#2); import e uso de `pickService`/`SERVICES` (#1); slug da categoria oculta em `runSalesPipeline` (#8); fuso em `getBrasiliaInfo` se nao for Brasil (#12).
```ts
import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { publishScheduledPosts } from '@/lib/automation/publish-scheduler'
import { fetchNewsByTopic } from '@/lib/ai/news-curation'
import { generatePostContent } from '@/lib/ai/content-generator'
import { generateSalesPostContent } from '@/lib/ai/sales-post-generator'
import { generateCoverImage } from '@/lib/utils/hf-image'
import { pickService } from '@/lib/automation/embras-services'   // ADAPTAR
import type { AutomationSettings, AutomationDailyRun, AutomationCityHistory } from '@/lib/db/schema'
import type { NewsArticle } from '@/lib/ai/news-curation'

// ── Timezone (ADAPTAR o fuso se nao for Brasil) ──
const WEEKDAY_MAP: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }
function getBrasiliaInfo(): { date: string; hour: number; dayOfWeek: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, weekday: 'long',
  }).formatToParts(new Date())
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? '0'
  return { date: `${get('year')}-${get('month')}-${get('day')}`, hour: parseInt(get('hour'), 10), dayOfWeek: WEEKDAY_MAP[get('weekday')] ?? 0 }
}
// Slot 0 -> published@start ; Slot N -> scheduled@(start + N*interval)  (Brasilia UTC-3)
function getPublishInfo(slot: number, dateStr: string, startHour: number, startMinute: number, intervalHours: number): { status: 'published' | 'scheduled'; publishedAt: string } {
  const h = startHour + slot * intervalHours
  const pad = (n: number) => String(n).padStart(2, '0')
  const publishedAt = `${dateStr}T${pad(h)}:${pad(startMinute)}:00-03:00`   // ADAPTAR offset se outro fuso
  return { status: slot === 0 ? 'published' : 'scheduled', publishedAt: new Date(publishedAt).toISOString() }
}

// ── Daily run (idempotencia) ──
async function getOrCreateDailyRun(date: string, type: 'news' | 'sales', target: number): Promise<AutomationDailyRun> {
  const { data: existing } = await supabaseAdmin.from('automation_daily_runs').select('*').eq('run_date', date).eq('run_type', type).maybeSingle()
  if (existing) return existing as AutomationDailyRun
  const { data: created, error } = await supabaseAdmin.from('automation_daily_runs').insert({ run_date: date, run_type: type, posts_target: target }).select('*').single()
  if (error || !created) throw new Error(`Failed to create daily run (${type}): ${error?.message ?? 'no data'}`)
  return created as AutomationDailyRun
}
async function updateDailyRun(id: string, postsCreated: number, target: number): Promise<void> {
  await supabaseAdmin.from('automation_daily_runs').update({ posts_created: postsCreated, completed: postsCreated >= target, last_attempt_at: new Date().toISOString() }).eq('id', id)
}

// ── City rotation (regiao prioritaria, menos usada). ADAPTAR 'Sudeste' (#9) ──
async function getNextCity(today: string): Promise<AutomationCityHistory | null> {
  const { data: priority } = await supabaseAdmin.from('automation_city_history').select('*')
    .eq('region', 'Sudeste')   // ADAPTAR
    .or(`last_used_date.is.null,last_used_date.lt.${today}`)
    .order('last_used_date', { ascending: true, nullsFirst: true }).order('usage_count', { ascending: true }).limit(1).maybeSingle()
  if (priority) return priority as AutomationCityHistory
  const { data: any } = await supabaseAdmin.from('automation_city_history').select('*')
    .or(`last_used_date.is.null,last_used_date.lt.${today}`)
    .order('last_used_date', { ascending: true, nullsFirst: true }).order('usage_count', { ascending: true }).limit(1).maybeSingle()
  return (any as AutomationCityHistory | null) ?? null
}
async function markCityUsed(cityId: string, currentCount: number, today: string): Promise<void> {
  await supabaseAdmin.from('automation_city_history').update({ last_used_date: today, usage_count: currentCount + 1 }).eq('id', cityId)
}

// ── Persiste imagem gerada no Storage (URLs temporarias do HF expiram) ──
async function persistImageToStorage(tempUrl: string): Promise<string> {
  try {
    const res = await fetch(tempUrl); if (!res.ok) return tempUrl
    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') ?? 'image/jpeg'
    const ext = contentType.split('/')[1]?.split(';')[0] ?? 'jpg'
    const path = `ai-generated/${Date.now()}.${ext}`
    const { error } = await supabaseAdmin.storage.from('cover-images').upload(path, Buffer.from(buffer), { contentType, cacheControl: '31536000', upsert: false })
    if (error) return tempUrl
    return supabaseAdmin.storage.from('cover-images').getPublicUrl(path).data.publicUrl
  } catch { return tempUrl }
}

async function resolveCategory(name: string, slug: string, description: string): Promise<string> {
  const { data: existing } = await supabaseAdmin.from('categories').select('id').eq('slug', slug).maybeSingle()
  if (existing) return existing.id
  const { data: created, error } = await supabaseAdmin.from('categories').insert({ name, slug, description }).select('id').single()
  if (error || !created) throw new Error(`Failed to resolve category "${slug}": ${error?.message}`)
  return created.id
}

type PipelineResult = { created: number; errors: string[]; completed: boolean }

// ── NEWS PIPELINE — ADAPTAR topicos (#2) ──
const NEWS_TOPICS = ['Iluminacao', 'Arquitetura', 'Design de Interiores']   // ADAPTAR
const TOPIC_CATEGORY: Record<string, { name: string; slug: string; description: string }> = {   // ADAPTAR
  'Iluminacao':           { name: 'Iluminacao',          slug: 'iluminacao',          description: 'Noticias e tendencias sobre iluminacao' },
  'Arquitetura':          { name: 'Arquitetura',          slug: 'arquitetura',          description: 'Noticias e tendencias sobre arquitetura' },
  'Design de Interiores': { name: 'Design de Interiores', slug: 'design-de-interiores', description: 'Noticias e tendencias sobre design de interiores' },
}

async function runNewsPipeline(run: AutomationDailyRun, date: string, startHour: number, startMinute: number, intervalHours: number): Promise<PipelineResult> {
  const botId = process.env.AI_BOT_PROFILE_ID
  if (!botId) throw new Error('AI_BOT_PROFILE_ID env var not set')

  const topicCategoryIds = Object.fromEntries(await Promise.all(NEWS_TOPICS.map(async (topic) => {
    const cat = TOPIC_CATEGORY[topic]; return [topic, await resolveCategory(cat.name, cat.slug, cat.description)] as [string, string]
  })))

  const { data: existingRows } = await supabaseAdmin.from('posts').select('source_url').not('source_url', 'is', null)
  const knownUrls = new Set<string>((existingRows ?? []).map((r) => r.source_url as string).filter(Boolean))

  let created = run.posts_created
  const errors: string[] = []
  for (let slot = run.posts_created; slot < run.posts_target; slot++) {
    let article: NewsArticle | null = null
    let foundTopic = NEWS_TOPICS[slot % NEWS_TOPICS.length]
    for (let t = 0; t < NEWS_TOPICS.length; t++) {
      const topic = NEWS_TOPICS[(slot + t) % NEWS_TOPICS.length]
      try {
        const fresh = (await fetchNewsByTopic(topic)).filter((a) => a.url && !knownUrls.has(a.url))
        if (fresh.length > 0) { article = fresh[0]; foundTopic = topic; break }
      } catch (err) { console.warn(`[news-pipeline] fetch failed "${topic}": ${err instanceof Error ? err.message : err}`) }
    }
    if (!article) { errors.push(`slot ${slot}: no fresh article found`); continue }
    knownUrls.add(article.url)
    try {
      const generated = await generatePostContent({ title: article.title, url: article.url, description: article.description, density: article.density ?? 'general' })
      const { url: imgUrl, origin: imgOrigin } = await generateCoverImage(generated.image_prompt)
      const coverImage = (imgOrigin === 'flux' || imgOrigin === 'imagen4') ? await persistImageToStorage(imgUrl) : imgUrl
      const { status, publishedAt } = getPublishInfo(slot, date, startHour, startMinute, intervalHours)
      const slug = `${generated.slug}-${Math.floor(Math.random() * 9000) + 1000}`
      const { data: post, error: insertErr } = await supabaseAdmin.from('posts').insert({
        title: generated.title, slug, content: generated.content, excerpt: generated.excerpt, status,
        author_id: botId, category_id: topicCategoryIds[foundTopic], source_url: article.url,
        image_prompt: generated.image_prompt, cover_image: coverImage,
        seo_title: generated.seo_title, seo_description: generated.seo_description, seo_keywords: generated.seo_keywords, published_at: publishedAt,
      }).select('id').single()
      if (insertErr || !post) throw new Error(insertErr?.message ?? 'no post data')
      await supabaseAdmin.from('ai_automation_logs').insert({
        post_id: post.id, prompt_used: article.url, model_version: generated.model_used, token_usage: null,
        raw_response: { type: 'auto_news', topic: NEWS_TOPICS[slot % NEWS_TOPICS.length], slot, imageOrigin: imgOrigin } as Record<string, unknown>,
      })
      created++
    } catch (err) { errors.push(`slot ${slot}: ${err instanceof Error ? err.message : String(err)}`) }
  }
  await updateDailyRun(run.id, created, run.posts_target)
  return { created: created - run.posts_created, errors, completed: created >= run.posts_target }
}

// ── SALES PIPELINE — ADAPTAR categoria oculta (#8) e servico (#1) ──
async function runSalesPipeline(run: AutomationDailyRun, date: string, startHour: number, startMinute: number, intervalHours: number): Promise<PipelineResult> {
  const botId = process.env.AI_BOT_PROFILE_ID
  if (!botId) throw new Error('AI_BOT_PROFILE_ID env var not set')
  const categoryId = await resolveCategory('Google', 'google', 'Artigos de vendas para SEO — nao exibidos no blog')   // ADAPTAR slug (#8)

  let created = run.posts_created
  const errors: string[] = []
  for (let slot = run.posts_created; slot < run.posts_target; slot++) {
    try {
      const city = await getNextCity(date)
      if (!city) { errors.push(`slot ${slot}: no city available`); break }
      const service = pickService(date, slot)   // ADAPTAR
      const cityLabel = `${city.city}, ${city.state_code}`
      const generated = await generateSalesPostContent(service, cityLabel)
      const { status, publishedAt } = getPublishInfo(slot, date, startHour, startMinute, intervalHours)
      const slug = `${generated.slug}-${Math.floor(Math.random() * 9000) + 1000}`
      const { data: post, error: insertErr } = await supabaseAdmin.from('posts').insert({
        title: generated.title, slug, content: generated.content, excerpt: generated.excerpt, status,
        author_id: botId, category_id: categoryId, source_url: null, image_prompt: null, cover_image: null,
        seo_title: generated.seo_title, seo_description: generated.seo_description, seo_keywords: generated.seo_keywords, published_at: publishedAt,
      }).select('id').single()
      if (insertErr || !post) throw new Error(insertErr?.message ?? 'no post data')
      await markCityUsed(city.id, city.usage_count, date)
      await supabaseAdmin.from('ai_automation_logs').insert({
        post_id: post.id, prompt_used: `auto-sales | servico: ${service} | cidade: ${cityLabel}`, model_version: generated.model_used, token_usage: null,
        raw_response: { type: 'auto_sales', service, city: city.city, state: city.state_code, region: city.region, slot } as Record<string, unknown>,
      })
      created++
    } catch (err) { errors.push(`slot ${slot}: ${err instanceof Error ? err.message : String(err)}`) }
  }
  await updateDailyRun(run.id, created, run.posts_target)
  return { created: created - run.posts_created, errors, completed: created >= run.posts_target }
}

// ── ENTRY POINT ──
export type AutomationRunResult =
  | { skipped: string; scheduledPublished: number }
  | { ok: true; date: string; scheduledPublished: number; news?: PipelineResult; sales?: PipelineResult }

export async function runAutomation(): Promise<AutomationRunResult> {
  const scheduledPublished = await publishScheduledPosts()
  const { data: settings, error } = await supabaseAdmin.from('automation_settings').select('*').maybeSingle()
  if (error || !settings) throw new Error(`Failed to load automation settings: ${error?.message ?? 'no row found'}`)
  const cfg = settings as AutomationSettings
  if (!cfg.is_enabled) return { skipped: 'automation_disabled', scheduledPublished }

  const { date, hour, dayOfWeek } = getBrasiliaInfo()
  if (!cfg.active_days.includes(dayOfWeek)) return { skipped: `inactive_day (${dayOfWeek})`, scheduledPublished }
  if (hour < cfg.cron_start_hour) return { skipped: `too_early (${hour}h < ${cfg.cron_start_hour}h)`, scheduledPublished }

  const [newsRun, salesRun] = await Promise.all([
    cfg.news_posts_per_day > 0 ? getOrCreateDailyRun(date, 'news', cfg.news_posts_per_day) : null,
    cfg.sales_posts_per_day > 0 ? getOrCreateDailyRun(date, 'sales', cfg.sales_posts_per_day) : null,
  ])
  const newsComplete = !newsRun || newsRun.completed
  const salesComplete = !salesRun || salesRun.completed
  if (newsComplete && salesComplete) return { skipped: 'daily_goal_already_met', scheduledPublished }

  const result: { ok: true; date: string; scheduledPublished: number; news?: PipelineResult; sales?: PipelineResult } = { ok: true, date, scheduledPublished }
  if (newsRun && !newsRun.completed) result.news = await runNewsPipeline(newsRun, date, cfg.cron_start_hour, cfg.cron_start_minute, cfg.post_interval_hours)
  if (salesRun && !salesRun.completed) result.sales = await runSalesPipeline(salesRun, date, cfg.cron_start_hour, cfg.cron_start_minute, cfg.post_interval_hours)
  return result
}
```

---

## [B-8] Endpoint de cron (`src/app/api/cron/auto-publish/route.ts`)
```ts
import { type NextRequest, NextResponse } from 'next/server'
import { runAutomation } from '@/lib/automation/cron-runner'

export const runtime = 'nodejs'
export const maxDuration = 300   // 5 min — pipeline completo. Exige Vercel Pro; senao use agendador externo.

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    if (req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })   // em prod, CRON_SECRET e obrigatorio
  }
  try {
    const result = await runAutomation()
    console.info('[cron/auto-publish] result:', JSON.stringify(result))
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unexpected error' }, { status: 500 })
  }
}
```

### `vercel.json` (agendamento horário)
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [{ "path": "/api/cron/auto-publish", "schedule": "0 * * * *" }]
}
```

---

## [B-9] Painel admin de configuração

### [B-9.1] `src/app/(admin)/admin/automation/settings/page.tsx`
```tsx
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { getAutomationSettings } from '@/server/automation.actions'
import { AutomationSettingsForm } from '@/components/admin/automation-settings-form'

export const metadata = { title: 'Automacao — Configuracoes' }

export default async function AutomationSettingsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const settings = await getAutomationSettings()
  if (!settings) return <p>Tabela automation_settings nao encontrada — rode as migrations.</p>
  return (
    <div>
      <h1>Configuracoes de Automacao</h1>
      <AutomationSettingsForm settings={settings} />
    </div>
  )
}
```

### [B-9.3] `src/server/automation.actions.ts`
```ts
'use server'
import { createSupabaseServerClient } from '@/lib/db/supabase-server'
import { supabaseAdmin } from '@/lib/db/supabase-admin'
import { revalidatePath } from 'next/cache'
import type { AutomationSettings } from '@/lib/db/schema'

export async function getAutomationSettings(): Promise<AutomationSettings | null> {
  const { data } = await supabaseAdmin.from('automation_settings').select('*').maybeSingle()
  return (data as AutomationSettings | null) ?? null
}

export type SaveSettingsResult = { error: string } | { success: true }

export async function saveAutomationSettingsAction(_prev: SaveSettingsResult | null, formData: FormData): Promise<SaveSettingsResult> {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Nao autenticado' }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Apenas administradores podem alterar' }

  const startHour = parseInt(formData.get('cron_start_hour') as string, 10)
  const startMinute = parseInt(formData.get('cron_start_minute') as string, 10)
  const intervalHours = parseInt(formData.get('post_interval_hours') as string, 10)
  const newsPerDay = parseInt(formData.get('news_posts_per_day') as string, 10)
  const salesPerDay = parseInt(formData.get('sales_posts_per_day') as string, 10)
  const isEnabled = formData.get('is_enabled') === 'on'
  const activeDays = [0, 1, 2, 3, 4, 5, 6].filter((d) => formData.get(`day_${d}`) === 'on')

  if (isNaN(startHour) || startHour < 0 || startHour > 23) return { error: 'Horario invalido (0-23)' }
  if (isNaN(startMinute) || startMinute < 0 || startMinute > 59) return { error: 'Minutos invalidos (0-59)' }
  if (isNaN(intervalHours) || intervalHours < 1 || intervalHours > 23) return { error: 'Intervalo invalido (1-23h)' }
  if (isNaN(newsPerDay) || newsPerDay < 0 || newsPerDay > 20) return { error: 'Noticias/dia invalido (0-20)' }
  if (isNaN(salesPerDay) || salesPerDay < 0 || salesPerDay > 20) return { error: 'Vendas/dia invalido (0-20)' }
  if (activeDays.length === 0) return { error: 'Selecione pelo menos um dia ativo' }

  // Todos os slots devem caber no mesmo dia (< 24h)
  const numSlots = Math.max(newsPerDay, salesPerDay)
  if (numSlots > 1 && startHour + (numSlots - 1) * intervalHours >= 24) {
    return { error: `Agendamento incompativel: o ultimo post passaria da meia-noite. Reduza posts ou intervalo.` }
  }

  const { data: current } = await supabaseAdmin.from('automation_settings').select('id').maybeSingle()
  if (!current) return { error: 'Configuracoes nao encontradas — rode as migrations' }
  const { error } = await supabaseAdmin.from('automation_settings').update({
    cron_start_hour: startHour, cron_start_minute: startMinute, post_interval_hours: intervalHours,
    active_days: activeDays, news_posts_per_day: newsPerDay, sales_posts_per_day: salesPerDay, is_enabled: isEnabled,
  }).eq('id', current.id)
  if (error) return { error: error.message }
  revalidatePath('/admin/automation/settings')
  return { success: true }
}
```

### [B-9.2] `src/components/admin/automation-settings-form.tsx` (essência)
> Client Component com preview de slots. Adapte os componentes de UI (`Input`/`Button`/`Label`) ao design system do destino — ou use elementos HTML puros. Campos do form: `is_enabled` (checkbox), `cron_start_hour`, `cron_start_minute`, `post_interval_hours`, `day_0`..`day_6` (checkboxes), `news_posts_per_day`, `sales_posts_per_day`. A `saveAutomationSettingsAction` le exatamente esses `name`s.
```tsx
'use client'
import { useActionState, useEffect, useState } from 'react'
import { saveAutomationSettingsAction, type SaveSettingsResult } from '@/server/automation.actions'
import type { AutomationSettings } from '@/lib/db/schema'

const DAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

export function AutomationSettingsForm({ settings }: { settings: AutomationSettings }) {
  const [state, formAction, isPending] = useActionState<SaveSettingsResult | null, FormData>(saveAutomationSettingsAction, null)
  const [startHour, setStartHour] = useState(settings.cron_start_hour)
  const [startMinute, setStartMinute] = useState(settings.cron_start_minute ?? 0)
  const [intervalHours, setIntervalHours] = useState(settings.post_interval_hours ?? 4)
  const [newsPerDay, setNewsPerDay] = useState(settings.news_posts_per_day)
  const [salesPerDay, setSalesPerDay] = useState(settings.sales_posts_per_day)

  const numSlots = Math.max(newsPerDay, salesPerDay)
  const scheduleInvalid = numSlots > 1 && startHour + (numSlots - 1) * intervalHours >= 24
  const slotTimes = Array.from({ length: numSlots }, (_, i) => ({
    time: `${String(startHour + i * intervalHours).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`,
    published: i === 0,
  }))
  const error = state && 'error' in state ? state.error : null
  useEffect(() => { if (state && 'success' in state) alert('Salvo.') ; else if (error) alert(error) }, [state])

  return (
    <form action={formAction}>
      <label><input type="checkbox" name="is_enabled" defaultChecked={settings.is_enabled} /> Automacao ativa</label>

      <div>
        <label>Horario de inicio</label>
        <input name="cron_start_hour" type="number" min={0} max={23} value={startHour} onChange={(e) => setStartHour(Math.min(23, Math.max(0, +e.target.value || 0)))} required /> h
        <input name="cron_start_minute" type="number" min={0} max={59} value={startMinute} onChange={(e) => setStartMinute(Math.min(59, Math.max(0, +e.target.value || 0)))} required /> min
      </div>

      <div>
        <label>Intervalo entre posts (horas)</label>
        <input name="post_interval_hours" type="number" min={1} max={23} value={intervalHours} onChange={(e) => setIntervalHours(Math.min(23, Math.max(1, +e.target.value || 1)))} required />
      </div>

      <div>
        <label>Dias ativos</label>
        {DAY_LABELS.map((label, idx) => (
          <label key={idx}><input type="checkbox" name={`day_${idx}`} defaultChecked={settings.active_days.includes(idx)} /> {label}</label>
        ))}
      </div>

      <div>
        <label>Noticias/dia</label>
        <input name="news_posts_per_day" type="number" min={0} max={20} value={newsPerDay} onChange={(e) => setNewsPerDay(Math.min(20, Math.max(0, +e.target.value || 0)))} required />
        <label>Vendas/dia</label>
        <input name="sales_posts_per_day" type="number" min={0} max={20} value={salesPerDay} onChange={(e) => setSalesPerDay(Math.min(20, Math.max(0, +e.target.value || 0)))} required />
      </div>

      {numSlots > 0 && (
        <div>
          Horarios: {slotTimes.map((s, i) => <span key={i}>{s.time}{s.published ? ' (publicado)' : ' (agendado)'} </span>)}
          {scheduleInvalid && <p>Invalido: o ultimo slot passa da meia-noite.</p>}
        </div>
      )}

      <button type="submit" disabled={isPending || scheduleInvalid}>{isPending ? 'Salvando...' : 'Salvar'}</button>
    </form>
  )
}
```

---

## Apêndice — Dependências npm da feature

```
@supabase/supabase-js  @supabase/ssr          # banco + auth
@google/generative-ai  groq-sdk               # geracao de texto (Gemini/Gemma + Llama)
@gradio/client                                 # imagem (HuggingFace FLUX)
rss-parser                                     # feeds RSS/Atom
zod                                            # validacao das respostas de IA
react-hook-form  @hookform/resolvers  sonner   # form de login e toasts (opcionais)
```

**Env vars (resumo):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `GOOGLE_AI_API_KEY`, `GOOGLE_AI_API_KEY_SEARCH` (opc), `GROQ_API_KEY` (opc), `HF_TOKEN` (opc), `NEWS_API_KEY` (opc), `UNSPLASH_ACCESS_KEY` (opc), `CRON_SECRET`, `AI_BOT_PROFILE_ID`.

--- FIM DO ROADMAP ---
