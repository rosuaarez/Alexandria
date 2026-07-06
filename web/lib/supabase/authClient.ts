import { createBrowserClient } from '@supabase/ssr'

// Cliente de navegador para Auth: apunta al Supabase EXTERNO (otro proyecto)
// del que se hereda la sesión — separado del Supabase de datos de Alexandria.
// Escenario A (mismo dominio raíz): la cookie de sesión se comparte y este
// cliente la lee. Solo se usa cuando FLAGS.USE_REAL_AUTH = true.
//
// IMPORTANTE: este archivo NO debe importar `next/headers` — lo consume código
// de cliente (adapter → store → AuthProvider). El cliente server-side vive en
// `authServer.ts`.
export function createAuthClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY!
  )
}
