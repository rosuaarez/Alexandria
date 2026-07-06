import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Cliente server-side para Auth: apunta al Supabase EXTERNO (otro proyecto) y
// lee la sesión desde las cookies de la request. Separado de `authClient.ts`
// porque importa `next/headers`, que SOLO puede usarse en código de servidor.
// Úsalo en route handlers / server components (p. ej. /api/health).
export async function createAuthServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll desde un Server Component: ignorable (lo gestiona el middleware).
          }
        },
      },
    }
  )
}
