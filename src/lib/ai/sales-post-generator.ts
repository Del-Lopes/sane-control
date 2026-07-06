import { gemini, gemma, gemma4, MODEL_NAMES } from '@/lib/ai/google-ai-client'
import { z } from 'zod'

const SalesPostSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string().min(100),
  excerpt: z.string(),
  seo_title: z.string(),
  seo_description: z.string(),
  seo_keywords: z.array(z.string()),
})
export type GeneratedSalesPost = z.infer<typeof SalesPostSchema> & { model_used: string }

// DADOS REAIS da Sane Control (do PERFIL-DO-NEGOCIO.md). NÃO inventar nada além disto.
const SYSTEM_PROMPT = `Você é um redator especialista em SEO comercial para o setor de controle de pragas e saneamento no mercado brasileiro.
Sua função é criar páginas de venda otimizadas para buscas locais do tipo "[serviço] + [cidade]".
Retorne APENAS um objeto JSON válido — sem markdown, sem texto extra.

DADOS REAIS DA EMPRESA (use SOMENTE estes — não invente nada):
- Nome: Sane Control (Sane Control Controle de Pragas)
- Fundada: 2006
- Sede: Caieiras/SP
- Atende: São Paulo (capital) e região metropolitana
- Especialidade: controle de pragas urbanas, higienização sanitária e saneamento
- Serviços: controle de pragas, desinsetização, desratização, descupinização, higienização de caixas d'água, sanitização, limpeza de estofados e desentupimento
- Diferenciais: produtos de baixo impacto ambiental; equipe própria (sem terceirização) com frota própria; higienização de caixa d'água sem desperdício de água; monitoramento pós-serviço
- Público: residências, condomínios, escolas, hospitais/clínicas e empresas
- WhatsApp/Telefone: (11) 96198-4360 (https://wa.me/5511961984360)
- Como converte: contato via WhatsApp e solicitação de orçamento

OBJETIVO: capturar tráfego orgânico com intenção de compra e converter em lead pelo WhatsApp.

ESTRUTURA (flexível): abertura com serviço+cidade no 1º parágrafo; sobre o serviço; por que a Sane Control; itens relacionados (4-6); contexto local; CTA com o WhatsApp real.

REGRAS DE SEO: keyword principal (serviço+cidade) 3-5x no total; nunca 2x no mesmo parágrafo; usar variações; H1 com serviço+cidade natural.
REGRAS ANTI-ALUCINAÇÃO: não inventar estatísticas, certificações, prêmios ou números de licença; não mencionar outras cidades além da pedida; se não souber algo específico da cidade, usar apenas São Paulo/região metropolitana.
REGRAS DE CTA (obrigatórias): incluir SEMPRE o WhatsApp real (11) 96198-4360; mencionar solicitação de orçamento; não criar links fictícios.
FORMATO: HTML semântico (<h1>,<h2>,<p>,<ul><li>,<strong>). NÃO usar classes CSS, <html>/<head>/<body>/<script>/<style>/<iframe>, nem markdown.

Retorne JSON com exatamente: title, slug (kebab-case sem acentos), content (HTML com h1+seções+CTA), excerpt (max 160), seo_title (max 60), seo_description (max 160), seo_keywords (array).`

const buildUserPrompt = (service: string, city: string): string =>
  `serviço: ${service}\ncidade: ${city}`

const parseJSON = (raw: string): unknown => {
  const stripped = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim()
  try {
    return JSON.parse(stripped)
  } catch {
    const m = stripped.match(/\{[\s\S]*\}/)
    if (m) return JSON.parse(m[0])
    throw new Error('Nenhum JSON encontrado na resposta')
  }
}

const MODELS = [
  { client: gemini, name: MODEL_NAMES.content },
  { client: gemma, name: MODEL_NAMES.gemma },
  { client: gemma4, name: MODEL_NAMES.gemma4 },
]

export const generateSalesPostContent = async (
  service: string,
  city: string
): Promise<GeneratedSalesPost> => {
  const userPrompt = buildUserPrompt(service, city)
  const errors: string[] = []
  for (const { client, name } of MODELS) {
    try {
      const result = await client.generateContent({
        systemInstruction: SYSTEM_PROMPT,
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      })
      const parsed = SalesPostSchema.safeParse(parseJSON(result.response.text()))
      if (!parsed.success) {
        errors.push(`[${name}] schema inválido`)
        continue
      }
      return { ...parsed.data, model_used: name }
    } catch (err) {
      errors.push(`[${name}] ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  throw new Error(`Todos os modelos falharam ao gerar o artigo de vendas:\n${errors.join('\n')}`)
}
