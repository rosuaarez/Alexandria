import { createAuthClient } from '@/lib/supabase/authClient'

// ─────────────────────────────────────────────────────────────────────────
// SSO UiX Lingo (Escenario B1)
//
// El proyecto de AUTH externo de Alexandria ES el proyecto Supabase de UiX
// Lingo (NEXT_PUBLIC_AUTH_SUPABASE_URL apunta a él). Por eso reutilizamos el
// cliente `@supabase/ssr` de navegador (`createAuthClient`) tanto para:
//   1) establecer la sesión con los tokens del handoff → queda en COOKIE
//      (visible para el middleware `proxy.ts`), y
//   2) leer el perfil de la tabla `ranking_user` (solo lectura).
//
// Diferencia clave con el snippet original de UiX: aquel usaba
// `createClient` de `@supabase/supabase-js` (sesión en localStorage, invisible
// para el middleware). Aquí el `setSession` escribe cookie.
// ─────────────────────────────────────────────────────────────────────────

export interface UiXProfile {
  email: string
  nombre: string
  emp_id: string // identificador del equipo/empresa ('' = sin equipo)
  proyectos: string[]
  seniority?: string
  especialidad?: string
}

// Forma de la fila de ranking_user (proyecto UiX Lingo, solo lectura).
interface RankingUserRow {
  email: string
  nombre: string | null
  emp_id: string | number | null
  proyecto: string | null
  proyecto_2: string | null
  proyecto_3: string | null
  proyecto_4: string | null
  seniority: string | null
  especialidad: string | null
}

// Lee el perfil completo del usuario desde UiX Lingo por email.
// Si no hay fila (email no está en UiX), devuelve un perfil "sin equipo" en
// vez de fallar: el login no se bloquea por un mismatch de datos.
export async function fetchUiXProfile(email: string): Promise<UiXProfile> {
  const supabase = createAuthClient()
  const { data } = await supabase
    .from('ranking_user')
    .select(
      'email, nombre, emp_id, proyecto, proyecto_2, proyecto_3, proyecto_4, seniority, especialidad'
    )
    .eq('email', email.toLowerCase())
    .maybeSingle()

  const row = data as RankingUserRow | null
  if (!row) {
    return { email, nombre: '', emp_id: '', proyectos: [] }
  }

  const proyectos = [row.proyecto, row.proyecto_2, row.proyecto_3, row.proyecto_4]
    .filter((p): p is string => p != null && String(p).trim() !== '')
    .map((p) => String(p).trim())

  return {
    email: row.email,
    nombre: row.nombre || '',
    emp_id: row.emp_id != null ? String(row.emp_id).trim() : '',
    proyectos,
    seniority: row.seniority || undefined,
    especialidad: row.especialidad || undefined,
  }
}

// Consume el handoff SSO de un solo uso: lee los tokens que UiX Lingo dejó en
// sessionStorage (_sso_at/_sso_rt), los canjea por una sesión (que queda en
// COOKIE vía el cliente ssr) y los borra. Idempotente: si no hay tokens (ya se
// consumieron o el usuario ya tenía sesión), devuelve false sin efectos.
export async function consumeSsoHandoff(): Promise<boolean> {
  if (typeof window === 'undefined') return false

  // ── [SSO-DEBUG] temporal: ¿por dónde llegan (o no) los tokens? ────────────
  // sessionStorage NO se comparte entre orígenes ni a una pestaña nueva de otra
  // app; el único canal cross-origin al abrir pestaña es la URL (?query o #hash).
  console.log('[SSO-DEBUG] consumeSsoHandoff() start', {
    href: window.location.href,
    search: window.location.search,
    hash: window.location.hash,
    hasTokenInSearch:
      window.location.search.includes('_sso_at') ||
      window.location.hash.includes('_sso_at'),
    ssAt: sessionStorage.getItem('_sso_at') ? 'present' : 'absent',
    ssRt: sessionStorage.getItem('_sso_rt') ? 'present' : 'absent',
  })
  // ──────────────────────────────────────────────────────────────────────────

  const ssoAt = sessionStorage.getItem('_sso_at')
  const ssoRt = sessionStorage.getItem('_sso_rt')
  if (!ssoAt || !ssoRt) {
    console.log(
      '[SSO-DEBUG] consumeSsoHandoff() → NO hay tokens en sessionStorage; se aborta el canje (no habrá sesión)'
    )
    return false
  }

  // Tokens de un solo uso: se borran antes de canjearlos.
  sessionStorage.removeItem('_sso_at')
  sessionStorage.removeItem('_sso_rt')

  const supabase = createAuthClient()
  const { data, error } = await supabase.auth.setSession({
    access_token: ssoAt,
    refresh_token: ssoRt,
  })

  const email = data.session?.user?.email
  console.log('[SSO-DEBUG] setSession() result', {
    error: error?.message ?? null,
    email: email ?? null,
  })
  if (error || !email) return false

  sessionStorage.setItem('uix_email', email)
  return true
}
