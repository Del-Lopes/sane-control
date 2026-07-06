# PERFIL-DO-NEGÓCIO — Sane Control

> Produto da **Fase 0** do `ROADMAP_AUTO_BLOG.md`. Fonte de verdade de negócio que alimenta todos os prompts de IA e seeds das fases seguintes. Extraído por auto-análise do projeto (`src/lib/site.ts`, `src/lib/services.ts`, `tailwind.config.ts`, `src/app/**`, `package.json`) e da memória do projeto.

---

## 1. Identidade da empresa

| Campo | Valor |
|---|---|
| **Nome** | Sane Control |
| **Razão social / nome legal** | Sane Control Controle de Pragas |
| **Setor / o que faz** | Empresa de controle de pragas urbanas e higienização sanitária. Atende residências, condomínios, escolas, hospitais/clínicas e empresas com desinsetização, desratização, descupinização, higienização de caixa d'água, sanitização, limpeza de estofados e desentupimento. |
| **Tagline** | "Compromisso com a segurança e manutenção do seu lar" |
| **No mercado desde** | 2006 |
| **Sede** | Caieiras / SP |
| **Domínio de produção** | https://www.sanecontrol.com.br |

## 2. Produtos / serviços (catálogo — base do `pickService` e da Fase 5/6)

> Slugs abaixo correspondem às páginas reais em `/servicos/[slug]` — usar nos links de fechamento SEO (#7).

1. **Controle de Pragas** (`controle-de-pragas`) — programa completo: desinsetização + desratização + descupinização.
2. **Desinsetização** (`desinsetizacao`) — insetos rasteiros e voadores (baratas, formigas, mosquitos, moscas); pulverização, gel, nebulização.
3. **Desratização** (`desratizacao`) — roedores; estações porta-iscas seguras + monitoramento.
4. **Descupinização** (`descupinizacao`) — cupins de madeira seca, subterrâneos e arborícolas.
5. **Higienização de Caixas d'Água** (`higienizacao-caixa-dagua`) — limpeza de reservatórios sem desperdício de água.
6. **Sanitização** (`sanitizacao`) — desinfecção por nebulização contra fungos, bactérias e vírus.
7. **Limpeza de Estofados** (`limpeza-de-estofados`) — higienização profunda de sofás, colchões, poltronas.
8. **Desentupimento** (`desentupimento`) — tubulações, poços pluviais, caixas de gordura.

**Diferenciais (para CTA/vendas):** produtos de baixo impacto ambiental; higienização de caixa d'água sem esvaziar; equipe própria (sem terceirização) com frota própria; monitoramento pós-serviço.

## 3. Segmentos / público-alvo

Residencial · Condomínios · Escolas · Hospitais e clínicas · Empresas e comércios.

## 4. Região atendida (seed de `automation_city_history` — SEO local)

- **Sede:** Caieiras/SP.
- **Área de atuação:** São Paulo (capital) e **região metropolitana**.
- **Região prioritária de rotação:** `Sudeste` (manter o padrão `region='Sudeste'` do [B-7.2] `getNextCity`).
- **Cidades-seed (✅ validado pelo usuário em 2026-07-06):**
  Caieiras, São Paulo, Franco da Rocha, Francisco Morato, Mairiporã, Cajamar, Guarulhos, Osasco, Barueri, Santana de Parnaíba, Perus (SP-capital), Jundiaí. Todas `state='São Paulo'`, `state_code='SP'`, `region='Sudeste'`.

## 5. Conversão / contatos

| Campo | Valor |
|---|---|
| **Canal principal de conversão** | **WhatsApp** (não há backend de e-mail hoje; o formulário de contato monta mensagem e abre o WhatsApp). |
| **WhatsApp (display)** | (11) 96198-4360 |
| **WhatsApp (número wa.me)** | 5511961984360 |
| **Link** | https://wa.me/5511961984360 |
| **Horário** | Seg–Sex 7h–17h; atendimento noturno e domingos sob agendamento. |
| **E-mail / endereço completo / redes sociais** | ⚠️ CONFIRMAR COM O USUÁRIO — não encontrados no site atual. (Não bloqueia a automação.) |

## 6. Credenciais / certificações (citar sem alucinar)

- Licença de Funcionamento **ANVISA**
- Registro Municipal (Prefeitura de Caieiras) **nº 9081**
- Conselho Regional de Química — **ART 9135**
- **PPRA** (Prevenção de Riscos Ambientais) · **PCMSO** (Saúde Ocupacional)
- **NR-33** (Espaços Confinados) · **NR-35** (Trabalho em Altura)

> Regra anti-alucinação: a IA só pode citar exatamente estas licenças/números. Setor de **saúde/higiene sanitária** é sensível — considerar `status='review_required'` nos primeiros dias (Risco #3 do roadmap).

## 7. Tom de voz e idioma

- **Idioma:** Português do Brasil (pt-BR).
- **Tom:** profissional, acessível e tranquilizador; foco em segurança da família, saúde e prevenção; sem alarmismo. Linguagem clara para leigos, com autoridade técnica (equipe própria, licenças).

## 8. Marca (para o admin e capas — #13)

- **Cores:** vermelho **#DE1E11** (principal), #EB3D3D (destaque), #961B1B (escuro), #F6D9D9 (fundo suave). Texto: #2A2A2A / #54595F / #7A7A7A. **Marca é VERMELHO + branco — NÃO verde.**
- **Fonte:** Inter (`next/font/google`, var `--font-inter`).
- **Logo:** alvo vermelho em `public/brand/` (`logo-192.png` usado como favicon).

## 9. Temas de conteúdo do blog (viram `NEWS_TOPICS` + categorias — #2)

Categorias atuais no blog estático: **Prevenção, Saúde, Pragas**. Temas plausíveis derivados do setor para o pipeline de notícias/conteúdo:

- **Pragas urbanas** (baratas, ratos, cupins, escorpiões, mosquitos, Aedes/dengue)
- **Prevenção** (hábitos, higiene doméstica, vedação, descarte de lixo)
- **Saúde e saneamento** (água potável, caixa d'água, doenças transmitidas por pragas, vigilância sanitária)
- **Dengue / arboviroses** (sazonal, forte apelo de saúde pública)
- **Condomínios e empresas** (controle sanitário, conformidade, dedetização coletiva)

> Categoria oculta de vendas: manter o conceito `google` (slug `google`) do roadmap — artigos SEO local por cidade×serviço, indexáveis mas fora da listagem do blog (`HIDDEN_SLUGS=['google']`).

## 10. Fuso horário

`America/Sao_Paulo` (UTC−03:00) — público 100% Brasil. Manter os defaults de timezone do [B-7.2].

---

## 11. Stack atual (análise técnica)

| Item | Estado |
|---|---|
| **Framework** | Next.js **14.2.5**, **App Router**, React 18, **TypeScript** (strict), Tailwind 3.4. |
| **Alias de import** | `@/*` → `./src/*`. |
| **Estrutura** | `src/app/**` (rotas), `src/components/**`, `src/lib/{site,services,posts}.ts` (dados centralizados). |
| **Supabase / Auth / Admin / API routes / Server Actions** | **Nada disso existe ainda.** Sem banco, sem migrations, sem login, sem `/api/*`, sem área admin. Tudo será criado nas Fases 1, 2 e 4. |
| **Blog atual** | **Estático**: posts hardcoded em `src/lib/posts.ts` (`Post.body: string[]` — parágrafos, **não** HTML). Renderizado em `/blog` (grid) e `/blog/[slug]`. Categoria é string livre. → Fase 3 migra para banco + corpo HTML. |
| **Build** | SSG (`next build` gera ~18 rotas estáticas). Fase 3 precisará tornar as rotas do blog dinâmicas/ISR. |
| **`next.config.mjs`** | Só `reactStrictMode`. **Sem `images.remotePatterns`** → adicionar na Fase 1 (`*.supabase.co`, `images.unsplash.com`). |
| **`vercel.json`** | **Não existe** → criar na Fase 7 (cron). |
| **Plano Vercel** | ✅ **Hobby** (validado 2026-07-06). `maxDuration=300` NÃO disponível → Fase 7 usará **agendador externo** (cron-job.org ou GitHub Actions) chamando o endpoint com o Bearer `CRON_SECRET`. |
| **Projeto Supabase** | ✅ criado. URL `https://tqrshlgxnkrfxivzegmn.supabase.co`. Publishable key (=anon) fornecida. Falta a **service_role key** (secret). |

---

## 12. Pendências / ⚠️ CONFIRMAR (não bloqueiam a Fase 1)

- [ ] **E-mail, endereço completo e redes sociais** da empresa (não achados no site).
- [ ] **Lista final de cidades** do seed de SEO local (validar a sugestão da seção 4).
- [ ] **Plano Vercel** (Pro x Hobby) — define a estratégia de cron da Fase 7.
- [ ] Contas de serviços externos (Supabase, Google AI, `CRON_SECRET`) — 🛑 STOP HUMANO antes da Fase 1.

---

_Gerado na Fase 0. As fases seguintes referenciam este arquivo como "PERFIL-DO-NEGÓCIO.md"._
