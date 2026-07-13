import { NextResponse } from 'next/server'
import { createAuthServerClient } from '@/lib/supabase/authServer'
import { createDataAdminClient } from '@/lib/supabase/dataAdmin'
import { FLAGS } from '@/lib/config/flags'

export const runtime = 'nodejs'

// ─────────────────────────────────────────────────────────────────────────
// POST /api/auth/sync-profile
//
// Sincroniza el perfil de UiX Lingo (email, emp_id, proyectos…) hacia la tabla
// `user_profiles` del proyecto de DATOS de Alexandria. Se dispara (best-effort)
// tras resolver la sesión SSO en el cliente.
//
// Seguridad: NO confía en datos del cliente. Valida la sesión contra el
// proyecto AUTH (UiX Lingo) por cookie y relee el perfil server-side desde
// `ranking_user`. El body de la request se ignora por completo.
// ─────────────────────────────────────────────────────────────────────────

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

export async function POST() {
  // ── PASO 1 (crítico): autenticar QUIÉN es, ANTES de tocar privilegios ──────
  // Validamos la sesión SSO contra el proyecto AUTH (UiX Lingo) por cookie. El
  // email/uid confiables salen de aquí (getUser() revalida el JWT contra el
  // servidor de Auth), NUNCA del body de la request. Solo tras esto usamos la
  // service_role. Así un usuario no puede hacerse upsert de un emp_id ajeno:
  // el email con el que se escribe es el de SU sesión validada.
  const auth = await createAuthServerClient()
  const {
    data: { user },
    error: authError,
  } = await auth.auth.getUser()

  console.log('[SSO-DEBUG] /api/auth/sync-profile getUser()', {
    error: authError?.message ?? null,
    email: user?.email ?? null,
  })
  if (authError || !user?.email) {
    return NextResponse.json({ error: 'No hay sesión válida' }, { status: 401 })
  }
  const email = user.email.toLowerCase()

  // Sin persistencia real de datos: nada que sincronizar (modo mock).
  if (!FLAGS.USE_REAL_SUPABASE) {
    return NextResponse.json({ status: 'skipped', reason: 'mock' })
  }

  // 2) Releer el perfil desde ranking_user (mismo proyecto AUTH/UiX Lingo).
  const { data } = await auth
    .from('ranking_user')
    .select(
      'email, nombre, emp_id, proyecto, proyecto_2, proyecto_3, proyecto_4, seniority, especialidad'
    )
    .eq('email', email)
    .maybeSingle()
  const row = data as RankingUserRow | null

  const proyectos = row
    ? [row.proyecto, row.proyecto_2, row.proyecto_3, row.proyecto_4]
        .filter((p): p is string => p != null && String(p).trim() !== '')
        .map((p) => String(p).trim())
    : []
  const empId =
    row?.emp_id != null && String(row.emp_id).trim() !== ''
      ? String(row.emp_id).trim()
      : null

  // ── PASO 3: escritura privilegiada (service_role) en el proyecto de DATOS ──
  //    Solo ahora, con el usuario ya autenticado, usamos la service_role. Esta
  //    key ignora RLS por diseño y es SECRETA (server-only); por eso user_profiles
  //    puede tener RLS restrictivo sin policies para anon (ver migración 004).
  //    Regla de mismatch: NUNCA sobrescribir un emp_id existente con vacío. Si
  //    empId es null, lo omitimos del payload → en un upsert, la columna omitida
  //    conserva su valor previo (y en un insert queda null, "sin equipo").
  const dataDb = createDataAdminClient()
  const base = {
    id: user.id, // auth.uid() de UiX Lingo (identificador único)
    email,
    nombre: row?.nombre ?? '',
    proyectos,
    seniority: row?.seniority ?? null,
    especialidad: row?.especialidad ?? null,
    updated_at: new Date().toISOString(),
  }
  const payload = empId ? { ...base, emp_id: empId } : base

  const { error: dbError } = await dataDb
    .from('user_profiles')
    .upsert(payload, { onConflict: 'email' })

  if (dbError) {
    // Best-effort: no rompemos el login. Reportamos para diagnóstico.
    return NextResponse.json(
      { status: 'error', error: dbError.message },
      { status: 200 }
    )
  }

  return NextResponse.json({ status: 'ok', emp_id: empId })
}
