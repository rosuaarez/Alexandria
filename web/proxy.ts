import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Antes `middleware.ts`; renombrado a `proxy.ts` por la nueva convención de
// Next.js 16 (misma lógica y matcher, solo cambia el nombre del archivo/función).

// Rutas siempre accesibles (sin sesión).
// `/sso`: callback del handoff SSO de UiX Space. DEBE ser público para que el
// cliente canjee los tokens de la URL y escriba la cookie ANTES de ir a una
// ruta protegida (ver app/sso/page.tsx).
const PUBLIC_PATHS = ['/login', '/sso', '/api/health', '/api/auth']
// Solo se protegen las rutas de la app.
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/protocols',
  '/library',
  '/capsulas',
  '/team',
]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  if (!isProtected) return NextResponse.next()

  // Flag off → modo mock: dejar pasar (comportamiento de Sprint 8).
  if (process.env.NEXT_PUBLIC_USE_REAL_AUTH !== 'true') {
    return NextResponse.next()
  }

  // Verificar la sesión contra el Supabase de Auth EXTERNO.
  let response = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_AUTH_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() revalida el JWT contra el servidor de Auth (más seguro que
  // getSession() en middleware).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = process.env.NEXT_PUBLIC_EXTERNAL_LOGIN_URL
    if (loginUrl) {
      return NextResponse.redirect(
        `${loginUrl}?redirect=${encodeURIComponent(request.url)}`
      )
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
