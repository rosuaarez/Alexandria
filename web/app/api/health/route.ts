import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAuthServerClient } from '@/lib/supabase/authServer'
import { FLAGS } from '@/lib/config/flags'

export const runtime = 'nodejs'

// Estado de cada servicio:
//   'mock'         → el flag real está apagado (se usan mocks)
//   'connected'    → el flag está activo y el servicio respondió
//   'disconnected' → el flag está activo pero el servicio falló
type ServiceStatus = 'mock' | 'connected' | 'disconnected'

// El Auth puede estar 'connected' (cliente OK) aunque no haya sesión activa;
// hasSession indica si además hay una sesión válida en la cookie.
async function checkAuth(): Promise<{ status: ServiceStatus; hasSession: boolean }> {
  if (!FLAGS.USE_REAL_AUTH) return { status: 'mock', hasSession: false }
  try {
    const supabase = await createAuthServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return { status: 'connected', hasSession: !!session }
  } catch {
    return { status: 'disconnected', hasSession: false }
  }
}

async function checkSupabase(): Promise<ServiceStatus> {
  if (!FLAGS.USE_REAL_SUPABASE) return 'mock'
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('protocols')
      .select('id', { head: true, count: 'exact' })
    return error ? 'disconnected' : 'connected'
  } catch {
    return 'disconnected'
  }
}

async function checkGemini(): Promise<ServiceStatus> {
  if (!FLAGS.USE_REAL_GEMINI) return 'mock'
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_gemini_key_here') return 'disconnected'
  try {
    // Listar modelos es una llamada ligera que NO consume cuota de generación.
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: 'GET' }
    )
    return res.ok ? 'connected' : 'disconnected'
  } catch {
    return 'disconnected'
  }
}

export async function GET() {
  const [supabase, gemini, auth] = await Promise.all([
    checkSupabase(),
    checkGemini(),
    checkAuth(),
  ])

  return NextResponse.json({
    status: 'ok',
    services: { supabase, gemini, auth: auth.status },
    hasSession: auth.hasSession,
    flags: {
      USE_REAL_AUTH: FLAGS.USE_REAL_AUTH,
      USE_REAL_SUPABASE: FLAGS.USE_REAL_SUPABASE,
      USE_REAL_GEMINI: FLAGS.USE_REAL_GEMINI,
    },
  })
}
