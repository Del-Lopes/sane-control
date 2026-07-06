import { type NextRequest, NextResponse } from 'next/server'
import { runAutomation } from '@/lib/automation/cron-runner'

export const runtime = 'nodejs'
// Vercel Hobby: limite de 60s por função. (Pro permitiria 300.) O agendador externo
// chama de hora em hora; cada execução faz poucos posts, cabendo no limite.
export const maxDuration = 60
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    if (req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  } else if (process.env.NODE_ENV === 'production') {
    // Em produção, CRON_SECRET é obrigatório.
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }
  try {
    const result = await runAutomation()
    console.info('[cron/auto-publish] result:', JSON.stringify(result))
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unexpected error' },
      { status: 500 }
    )
  }
}
