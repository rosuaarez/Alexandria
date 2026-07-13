'use client'

import { useEffect, useState } from 'react'
import { createAuthClient } from '@/lib/supabase/authClient'

// ─────────────────────────────────────────────────────────────────────────
// Callback SSO de UiX Space (Escenario B1) — RUTA PÚBLICA.
//
// UiX Space debe abrir Alexandria AQUÍ (no en /dashboard) con los tokens de la
// sesión de UiX Lingo en la URL:
//     https://<alexandria>/sso?sso_at=<access_token>&sso_rt=<refresh_token>
//
// Por qué una ruta propia y no /dashboard: el middleware (proxy.ts) protege
// /dashboard y rebota server-side ANTES de que corra cualquier cliente, así que
// nunca podría canjear tokens de la URL. /sso está en PUBLIC_PATHS: el
// middleware la deja pasar, este cliente canjea los tokens → escribe la COOKIE
// de sesión (vía @supabase/ssr) → y recién ahí navega a /dashboard, donde el
// middleware ya encuentra la cookie.
//
// Soporta tokens por query (?sso_at=) y por hash (#sso_at=) — el hash no viaja
// al servidor, pero acá lo leemos client-side.
// ─────────────────────────────────────────────────────────────────────────

function readSsoTokens(): { at: string; rt: string } | null {
  if (typeof window === 'undefined') return null
  const fromSearch = new URLSearchParams(window.location.search)
  const fromHash = new URLSearchParams(
    window.location.hash.startsWith('#') ? window.location.hash.slice(1) : ''
  )
  const at = fromSearch.get('sso_at') || fromHash.get('sso_at')
  const rt = fromSearch.get('sso_rt') || fromHash.get('sso_rt')
  return at && rt ? { at, rt } : null
}

export default function SsoCallbackPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function run() {
      const tokens = readSsoTokens()

      // Sin tokens en la URL → no hay handoff que canjear. Mandamos al login
      // externo (UiX Space) para que reinicie el flujo.
      if (!tokens) {
        const loginUrl = process.env.NEXT_PUBLIC_EXTERNAL_LOGIN_URL
        window.location.replace(loginUrl || '/login')
        return
      }

      const supabase = createAuthClient()
      const { error: setErr } = await supabase.auth.setSession({
        access_token: tokens.at,
        refresh_token: tokens.rt,
      })
      if (cancelled) return

      if (setErr) {
        setError(
          'No se pudo iniciar la sesión con los datos recibidos. Volvé a entrar desde UiX Space.'
        )
        return
      }

      // Sesión ya materializada en cookie. Navegación COMPLETA (no router.push)
      // para garantizar que el middleware relea la cookie recién escrita.
      // replace() no deja /sso?sso_at=… en el historial (los tokens no quedan
      // en la barra de direcciones).
      window.location.replace('/dashboard')
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        fontFamily: 'system-ui, sans-serif',
        color: 'var(--text, #1a1a1a)',
        padding: '1.5rem',
        textAlign: 'center',
      }}
    >
      {error ? (
        <>
          <span style={{ fontSize: '2rem' }} aria-hidden="true">
            ⚠️
          </span>
          <p style={{ maxWidth: '28rem', lineHeight: 1.5 }}>{error}</p>
        </>
      ) : (
        <>
          <span style={{ fontSize: '2rem' }} aria-hidden="true">
            📖
          </span>
          <p>Iniciando sesión…</p>
        </>
      )}
    </div>
  )
}
